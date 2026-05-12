import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";

const router: IRouter = Router();

// Public: get all settings (values only — safe to expose)
router.get("/settings", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(siteSettingsTable).orderBy(siteSettingsTable.key);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "settings get failed");
    res.status(500).json({ error: "Internal error" });
  }
});

// Admin: upsert a setting by key
router.put("/settings/:key", requireAdmin, async (req: Request, res: Response) => {
  const key = req.params.key;
  const { value } = req.body as { value?: string };
  if (value === undefined) {
    res.status(400).json({ error: "value required" });
    return;
  }
  try {
    const [row] = await db
      .insert(siteSettingsTable)
      .values({ key, value: String(value), label: key, description: "" })
      .onConflictDoUpdate({
        target: siteSettingsTable.key,
        set: { value: String(value), updatedAt: new Date() },
      })
      .returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "settings upsert failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
