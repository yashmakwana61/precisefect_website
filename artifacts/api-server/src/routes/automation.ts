import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { requirePermission } from "../middlewares/permissionMiddleware";
import * as automationService from "../domains/automation/automation.service";

const router: IRouter = Router();

const ruleBody = z.object({
  name: z.string().min(1),
  enabled: z.boolean().optional(),
  triggerType: z.string().optional(),
  triggerEvent: z.string().min(1),
  triggerSchedule: z.string().nullable().optional(),
  conditions: z.record(z.string(), z.unknown()).optional(),
  actions: z.array(z.record(z.string(), z.unknown())).optional(),
  moduleKey: z.string().optional(),
});

const patchRuleBody = ruleBody.partial();

router.get(
  "/automation/rules",
  requirePermission("automation:read", "automation:write"),
  async (_req: Request, res: Response) => {
    try {
      const rules = await automationService.listRules();
      res.json(rules);
    } catch (err) {
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.get(
  "/automation/rules/:id",
  requirePermission("automation:read", "automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const rule = await automationService.getRule(id);
    if (!rule) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rule);
  },
);

router.post(
  "/automation/rules",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const parsed = ruleBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    const rule = await automationService.createRule(parsed.data);
    res.status(201).json(rule);
  },
);

router.patch(
  "/automation/rules/:id",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = patchRuleBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    const rule = await automationService.updateRule(id, parsed.data);
    if (!rule) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(rule);
  },
);

router.delete(
  "/automation/rules/:id",
  requirePermission("automation:write"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const ok = await automationService.deleteRule(id);
    if (!ok) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ok: true });
  },
);

router.get(
  "/automation/runs",
  requirePermission("automation:read", "automation:write"),
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 30;
    const runs = await automationService.listRuns(limit);
    res.json(runs);
  },
);

export default router;
