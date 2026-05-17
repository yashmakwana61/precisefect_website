import { Router, type IRouter } from "express";
import { blogPostsTable, customPagesTable } from "@workspace/db";
import { createCrudRouter } from "../lib/crud";
import { COLLECTION_REGISTRY } from "../domains/content/collections.registry";
import { eq, and, lte, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import type { Request, Response } from "express";

const router: IRouter = Router();

for (const [slug, def] of Object.entries(COLLECTION_REGISTRY)) {
  router.use(`/${slug}`, createCrudRouter(def));
}

router.get("/custom-pages/by-slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const isAdminView = req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");
    const conditions = [eq(customPagesTable.slug, slug)];
    if (!isAdminView) {
      conditions.push(eq(customPagesTable.isPublished, true));
      conditions.push(lte(customPagesTable.publishedAt, sql`now()`));
    }
    const [row] = await db
      .select()
      .from(customPagesTable)
      .where(and(...conditions))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "custom-page by-slug failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/blog-posts/by-slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const isAdminView = req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");
    const conditions = [eq(blogPostsTable.slug, slug)];
    if (!isAdminView) {
      conditions.push(eq(blogPostsTable.isPublished, true));
      conditions.push(lte(blogPostsTable.publishedAt, sql`now()`));
    }
    const [row] = await db
      .select()
      .from(blogPostsTable)
      .where(and(...conditions))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "blog-post by-slug failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
