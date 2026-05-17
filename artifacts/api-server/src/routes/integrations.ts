import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { requirePermission } from "../middlewares/permissionMiddleware";
import * as integrationsService from "../domains/integrations/integrations.service";
import { listDeliveries } from "../domains/integrations/delivery.service";
import { handleInboundLead } from "../domains/integrations/inbound.service";
import { checkRateLimit, clientIp } from "../lib/rate-limit";

const router: IRouter = Router();

const connectionBody = z.object({
  provider: z.enum(["webhook", "zapier", "resend"]),
  label: z.string().min(1).max(120),
  isEnabled: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  secrets: z.record(z.string(), z.string()).optional(),
});

router.get(
  "/integrations/connections",
  requirePermission("automation:read", "automation:write"),
  async (_req: Request, res: Response) => {
    const rows = await integrationsService.listConnections();
    res.json(rows);
  },
);

router.get(
  "/integrations/connections/:id",
  requirePermission("automation:read", "automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const row = await integrationsService.getConnection(id);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  },
);

router.post(
  "/integrations/connections",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const parsed = connectionBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    const row = await integrationsService.createConnection({
      ...parsed.data,
      createdById: req.userId,
    });
    res.status(201).json(row);
  },
);

router.patch(
  "/integrations/connections/:id",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const parsed = connectionBody.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    const row = await integrationsService.updateConnection(id, parsed.data);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  },
);

router.delete(
  "/integrations/connections/:id",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const ok = await integrationsService.deleteConnection(id);
    if (!ok) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ok: true });
  },
);

router.post(
  "/integrations/connections/:id/test",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await integrationsService.testConnection(id);
    res.json(result);
  },
);

router.get(
  "/integrations/deliveries",
  requirePermission("automation:read", "automation:write"),
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 50;
    const connectionId = req.query.connectionId
      ? Number(req.query.connectionId)
      : undefined;
    const rows = await listDeliveries(limit, connectionId);
    res.json(rows);
  },
);

router.post("/integrations/inbound/:token", async (req: Request, res: Response) => {
  const token = String(req.params.token ?? "");
  if (!token) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  const ip = clientIp(req);
  const rl = checkRateLimit(`inbound:${token}:${ip}`, 60, 60 * 1000);
  if (!rl.allowed) {
    res.status(429).json({ error: "Too many requests", retryAfterSec: rl.retryAfterSec });
    return;
  }

  const connection = await integrationsService.findByInboundToken(token);
  if (!connection?.isEnabled) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const result = await handleInboundLead(connection, req.body, {
    userAgent: String(req.headers["user-agent"] ?? ""),
  });

  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json({ ok: true, leadId: result.leadId });
});

export default router;
