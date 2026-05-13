import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and, lte, sql, asc } from "drizzle-orm";
import { db, sitePagesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";
import { recordRevision } from "../lib/revisions";

const router: IRouter = Router();

function normalizePath(raw: string): string {
  if (!raw) return "/";
  const trimmed = raw.trim();
  if (trimmed === "/") return "/";
  return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") || "/" : `/${trimmed.replace(/\/+$/, "")}`;
}

function isAdminView(req: Request): boolean {
  return req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");
}

router.get("/site-pages", async (req: Request, res: Response) => {
  try {
    const isAdmin = req.isAdmin && req.query.scope === "admin";
    const query = db.select().from(sitePagesTable).$dynamic();
    if (!isAdmin) {
      query.where(
        and(
          eq(sitePagesTable.isPublished, true),
          lte(sitePagesTable.publishedAt, sql`now()`),
        ),
      );
    }
    const rows = await query.orderBy(asc(sitePagesTable.path));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "site-pages list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/site-pages/content", async (req: Request, res: Response) => {
  const path = normalizePath(String(req.query.path ?? ""));
  if (!path) {
    res.status(400).json({ error: "path required" });
    return;
  }
  try {
    const adminView = isAdminView(req);
    const conditions = [eq(sitePagesTable.path, path)];
    if (!adminView) {
      conditions.push(eq(sitePagesTable.isPublished, true));
      conditions.push(lte(sitePagesTable.publishedAt, sql`now()`));
    }
    const [row] = await db
      .select()
      .from(sitePagesTable)
      .where(and(...conditions))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "site-pages content get failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.put("/site-pages/content", requireAdmin, async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const path = normalizePath(String(body.path ?? ""));
  const title = String(body.title ?? "").trim();
  if (!path || !title) {
    res.status(400).json({ error: "path and title required" });
    return;
  }
  try {
    const [row] = await db
      .insert(sitePagesTable)
      .values({
        path,
        title,
        heroEyebrow: String(body.heroEyebrow ?? ""),
        heroHeadline: String(body.heroHeadline ?? ""),
        heroSubheadline: String(body.heroSubheadline ?? ""),
        bodyContent: String(body.bodyContent ?? ""),
        metaTitle: String(body.metaTitle ?? ""),
        metaDescription: String(body.metaDescription ?? ""),
        isPublished: body.isPublished !== false,
        publishedAt: body.publishedAt ? new Date(String(body.publishedAt)) : new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: sitePagesTable.path,
        set: {
          title,
          heroEyebrow: String(body.heroEyebrow ?? ""),
          heroHeadline: String(body.heroHeadline ?? ""),
          heroSubheadline: String(body.heroSubheadline ?? ""),
          bodyContent: String(body.bodyContent ?? ""),
          metaTitle: String(body.metaTitle ?? ""),
          metaDescription: String(body.metaDescription ?? ""),
          isPublished: body.isPublished !== false,
          publishedAt: body.publishedAt ? new Date(String(body.publishedAt)) : new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    await recordRevision("site-pages", row.id, row as unknown as Record<string, unknown>, "update");
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "site-pages upsert failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
