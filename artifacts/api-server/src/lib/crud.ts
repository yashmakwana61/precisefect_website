import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc, desc } from "drizzle-orm";
import type { PgTable, PgColumn } from "drizzle-orm/pg-core";
import type { ZodTypeAny } from "zod";
import { db } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";

interface CrudOptions {
  table: PgTable & Record<string, PgColumn>;
  insertSchema: ZodTypeAny;
  updateSchema?: ZodTypeAny;
  publicFilter?: { column: PgColumn; value: unknown };
  orderBy?: { column: PgColumn; direction?: "asc" | "desc" };
}

export function createCrudRouter(opts: CrudOptions): IRouter {
  const router = Router();
  const { table, insertSchema, publicFilter, orderBy } = opts;
  const updateSchema = opts.updateSchema ?? insertSchema;
  const idColumn = table.id as PgColumn;

  const orderClause = orderBy
    ? orderBy.direction === "desc"
      ? desc(orderBy.column)
      : asc(orderBy.column)
    : undefined;

  router.get("/", async (req: Request, res: Response) => {
    try {
      const isAdminView = req.isAdmin && req.query.scope === "admin";
      const query = db.select().from(table).$dynamic();
      if (!isAdminView && publicFilter) {
        query.where(eq(publicFilter.column, publicFilter.value));
      }
      if (orderClause) query.orderBy(orderClause);
      const rows = await query;
      res.json(rows);
    } catch (err) {
      req.log.error({ err }, "list failed");
      res.status(500).json({ error: "Internal error" });
    }
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    try {
      const [row] = await db.select().from(table).where(eq(idColumn, id)).limit(1);
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(row);
    } catch (err) {
      req.log.error({ err }, "get failed");
      res.status(500).json({ error: "Internal error" });
    }
  });

  router.post("/", requireAdmin, async (req: Request, res: Response) => {
    const parsed = insertSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    try {
      const [row] = await db.insert(table).values(parsed.data).returning();
      res.status(201).json(row);
    } catch (err) {
      req.log.error({ err }, "create failed");
      res.status(500).json({ error: "Internal error" });
    }
  });

  router.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const parsed = updateSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    try {
      const updateData = { ...parsed.data, updatedAt: new Date() };
      const [row] = await db
        .update(table)
        .set(updateData)
        .where(eq(idColumn, id))
        .returning();
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(row);
    } catch (err) {
      req.log.error({ err }, "update failed");
      res.status(500).json({ error: "Internal error" });
    }
  });

  router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    try {
      const [row] = await db.delete(table).where(eq(idColumn, id)).returning();
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json({ ok: true });
    } catch (err) {
      req.log.error({ err }, "delete failed");
      res.status(500).json({ error: "Internal error" });
    }
  });

  return router;
}
