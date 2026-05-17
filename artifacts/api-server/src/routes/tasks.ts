import { Router, type IRouter, type Request, type Response } from "express";
import { requirePermission } from "../middlewares/permissionMiddleware";
import {
  getUserPermissions,
  canReadLead,
  canWriteLead,
  hasPermission,
} from "../domains/users/permissions";
import * as leadsService from "../domains/leads/leads.service";
import * as tasksService from "../domains/crm/tasks.service";
import { createTaskSchema, updateTaskSchema } from "../domains/crm/tasks.schemas";

const router: IRouter = Router();

router.get(
  "/tasks/dashboard",
  requirePermission("leads:read", "leads:read_all"),
  async (req: Request, res: Response) => {
    try {
      const actorId = hasPermission(
        await getUserPermissions(req.userId),
        "leads:read_all",
      )
        ? null
        : req.userId;
      const data = await tasksService.getTaskDashboard(actorId);
      res.json(data);
    } catch (err) {
      req.log.error({ err }, "task dashboard failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.get(
  "/tasks",
  requirePermission("leads:read", "leads:read_all"),
  async (req: Request, res: Response) => {
    const perms = await getUserPermissions(req.userId);
    const readAll = hasPermission(perms, "leads:read_all");
    const due = String(req.query.due ?? "");
    try {
      const rows = await tasksService.listTasks({
        status: (req.query.status as "open") || "open",
        due: due === "today" || due === "overdue" ? due : undefined,
        assignedToId: readAll ? undefined : (req.userId ?? undefined),
        limit: Number(req.query.limit) || 50,
      });
      res.json(rows);
    } catch (err) {
      req.log.error({ err }, "list tasks failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.get(
  "/leads/:leadId/tasks",
  requirePermission("leads:read", "leads:read_all"),
  async (req: Request, res: Response) => {
    const leadId = Number(req.params.leadId);
    if (!Number.isFinite(leadId)) {
      res.status(400).json({ error: "Invalid lead id" });
      return;
    }
    const lead = await leadsService.getLeadById(leadId);
    if (!lead) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const perms = await getUserPermissions(req.userId);
    if (!canReadLead(perms, lead, req.userId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const tasks = await tasksService.listTasksForLead(leadId);
    res.json(tasks);
  },
);

router.post(
  "/leads/:leadId/tasks",
  requirePermission("leads:write"),
  async (req: Request, res: Response) => {
    const leadId = Number(req.params.leadId);
    if (!Number.isFinite(leadId)) {
      res.status(400).json({ error: "Invalid lead id" });
      return;
    }
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    const lead = await leadsService.getLeadById(leadId);
    if (!lead) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const perms = await getUserPermissions(req.userId);
    if (!canWriteLead(perms, lead, req.userId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const task = await tasksService.createTask(leadId, parsed.data, req.userId);
    if (!task) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(201).json(task);
  },
);

router.patch(
  "/tasks/:id",
  requirePermission("leads:write"),
  async (req: Request, res: Response) => {
    const taskId = Number(req.params.id);
    if (!Number.isFinite(taskId)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    const existing = await tasksService.getTaskById(taskId);
    if (!existing) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const lead = await leadsService.getLeadById(existing.leadId);
    if (!lead) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const perms = await getUserPermissions(req.userId);
    if (!canWriteLead(perms, lead, req.userId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const task = await tasksService.updateTask(taskId, parsed.data, req.userId);
    res.json(task);
  },
);

export default router;
