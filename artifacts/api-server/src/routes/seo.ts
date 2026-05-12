import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, seoPagesTable, insertSeoPageSchema } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";

const router: IRouter = Router();

// Public: get SEO for a specific page slug
router.get("/seo", async (req: Request, res: Response) => {
  const slug = String(req.query.slug ?? "");
  if (!slug) {
    res.status(400).json({ error: "slug required" });
    return;
  }
  try {
    const [row] = await db.select().from(seoPagesTable).where(eq(seoPagesTable.slug, slug)).limit(1);
    res.json(row ?? null);
  } catch (err) {
    req.log.error({ err }, "seo get failed");
    res.status(500).json({ error: "Internal error" });
  }
});

// Admin: list all SEO entries
router.get("/seo/all", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(seoPagesTable).orderBy(seoPagesTable.slug);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "seo list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

// Admin: upsert SEO for a slug
router.put("/seo", requireAdmin, async (req: Request, res: Response) => {
  const parsed = insertSeoPageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .insert(seoPagesTable)
      .values({ ...parsed.data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: seoPagesTable.slug,
        set: { ...parsed.data, updatedAt: new Date() },
      })
      .returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "seo upsert failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
