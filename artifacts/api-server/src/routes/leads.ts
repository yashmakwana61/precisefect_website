import { Router, type IRouter, type Request, type Response } from "express";
import { LEAD_STATUSES, type LeadStatus } from "@workspace/db";
import { requirePermission } from "../middlewares/permissionMiddleware";
import {
  getUserPermissions,
  hasPermission,
  canReadLead,
  canWriteLead,
} from "../domains/users/permissions";
import { checkRateLimit, clientIp } from "../lib/rate-limit";
import {
  createLeadSchema,
  updateLeadSchema,
  createLeadNoteSchema,
  adminCreateLeadSchema,
} from "../domains/leads/leads.schemas";
import * as leadsService from "../domains/leads/leads.service";

const router: IRouter = Router();

router.post("/leads", async (req: Request, res: Response) => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
    return;
  }
  if (parsed.data.website) {
    res.status(400).json({ error: "Invalid submission" });
    return;
  }

  const ip = clientIp(req);
  const rl = checkRateLimit(`lead:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    res.status(429).json({ error: "Too many requests", retryAfterSec: rl.retryAfterSec });
    return;
  }

  try {
    const lead = await leadsService.createLead(parsed.data, {
      ip,
      userAgent: String(req.headers["user-agent"] ?? ""),
    });
    res.status(201).json({ id: lead.id, ok: true });
  } catch (err) {
    req.log.error({ err }, "create lead failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get(
  "/leads/stats",
  requirePermission("leads:read", "leads:read_all"),
  async (req: Request, res: Response) => {
    try {
      const stats = await leadsService.getLeadStats();
      res.json(stats);
    } catch (err) {
      req.log.error({ err }, "lead stats failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.get(
  "/leads",
  requirePermission("leads:read", "leads:read_all"),
  async (req: Request, res: Response) => {
    const status = String(req.query.status ?? "");
    const assignedRaw = String(req.query.assignedTo ?? "");
    let assignedTo: "me" | "unassigned" | number | undefined;
    if (assignedRaw === "me") assignedTo = "me";
    else if (assignedRaw === "unassigned") assignedTo = "unassigned";
    else if (assignedRaw && Number.isFinite(Number(assignedRaw))) assignedTo = Number(assignedRaw);

    const perms = await getUserPermissions(req.userId);
    const readAll = hasPermission(perms, "leads:read_all");

    try {
      const rows = await leadsService.listLeads({
        status: LEAD_STATUSES.includes(status as LeadStatus) ? (status as LeadStatus) : undefined,
        assignedTo,
        q: String(req.query.q ?? ""),
        unreadOnly: req.query.unreadOnly === "1" || req.query.unreadOnly === "true",
      limit: Number(req.query.limit) || 50,
      offset: Number(req.query.offset) || 0,
      actorUserId: req.userId,
      readAll,
      sort: req.query.sort === "score_desc" ? "score_desc" : "created_desc",
    });
      res.json(rows);
    } catch (err) {
      req.log.error({ err }, "list leads failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.post(
  "/leads/admin",
  requirePermission("leads:write"),
  async (req: Request, res: Response) => {
    const parsed = adminCreateLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    try {
      const lead = await leadsService.createLead(parsed.data, { userAgent: "admin" });
      res.status(201).json(lead);
    } catch (err) {
      req.log.error({ err }, "admin create lead failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.get(
  "/leads/:id",
  requirePermission("leads:read", "leads:read_all"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    try {
      const detail = await leadsService.getLeadDetail(id);
      if (!detail) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const perms = await getUserPermissions(req.userId);
      if (!canReadLead(perms, detail.lead, req.userId)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      await leadsService.markLeadRead(id, req.userId);
      detail.lead.isRead = true;
      res.json(detail);
    } catch (err) {
      req.log.error({ err }, "get lead failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.patch(
  "/leads/:id",
  requirePermission("leads:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = updateLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }

    const existing = await leadsService.getLeadById(id);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const perms = await getUserPermissions(req.userId);
    if (!canWriteLead(perms, existing, req.userId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (
      parsed.data.assignedToId !== undefined &&
      !hasPermission(perms, "leads:assign") &&
      !hasPermission(perms, "leads:read_all")
    ) {
      res.status(403).json({ error: "Cannot assign leads" });
      return;
    }

    try {
      const row = await leadsService.updateLead(id, parsed.data, req.userId);
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(row);
    } catch (err) {
      req.log.error({ err }, "update lead failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.post(
  "/leads/:id/notes",
  requirePermission("leads:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = createLeadNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }

    const existing = await leadsService.getLeadById(id);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const perms = await getUserPermissions(req.userId);
    if (!canWriteLead(perms, existing, req.userId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    try {
      const note = await leadsService.addLeadNote(id, parsed.data, req.userId);
      if (!note) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(201).json(note);
    } catch (err) {
      req.log.error({ err }, "add lead note failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

export default router;
