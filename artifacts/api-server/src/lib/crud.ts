import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc, desc, and, lte, sql } from "drizzle-orm";
import type { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { db } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";
import { recordRevision } from "./revisions";
import { logActivity } from "../domains/system/activity.service";
import type { CollectionDefinition } from "../domains/content/collections.registry";

function isAdminScope(req: Request): boolean {
  return req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");
}

function publicVisibilityWhere(
  opts: CollectionDefinition,
  isAdminView: boolean,
): ReturnType<typeof and> | undefined {
  if (isAdminView) return undefined;

  const parts: ReturnType<typeof and>[] = [];

  if (opts.publicFilter) {
    parts.push(eq(opts.publicFilter.column, opts.publicFilter.value));
  }

  if (opts.scheduleColumn) {
    parts.push(lte(opts.scheduleColumn, sql`now()`));
  }

  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return and(...parts);
}

function actorId(req: Request): number | null {
  return req.userId ?? null;
}

export function createCrudRouter(opts: CollectionDefinition): IRouter {
  const router = Router();
  const { table, insertSchema, entityType, orderBy, trackActor } = opts;
  const updateSchema = opts.insertSchema;
  const idColumn = table.id as PgColumn;

  const orderClause = orderBy
    ? orderBy.direction === "desc"
      ? desc(orderBy.column)
      : asc(orderBy.column)
    : undefined;

  router.get("/", async (req: Request, res: Response) => {
    try {
      const isAdminView = isAdminScope(req);
      const limit = Math.min(500, Math.max(1, Number(req.query.limit) || (isAdminView ? 200 : 100)));
      const offset = Math.max(0, Number(req.query.offset) || 0);
      const query = db.select().from(table).$dynamic();
      const where = publicVisibilityWhere(opts, isAdminView);
      if (where) query.where(where);
      if (orderClause) query.orderBy(orderClause);
      const rows = await query.limit(limit).offset(offset);
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
      const isAdminView = isAdminScope(req);
      const query = db.select().from(table).$dynamic();
      const where = publicVisibilityWhere(opts, isAdminView);
      if (where) {
        query.where(and(eq(idColumn, id), where));
      } else {
        query.where(eq(idColumn, id));
      }
      const [row] = await query.limit(1);
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
      const values = {
        ...parsed.data,
        ...(trackActor
          ? { createdById: actorId(req), updatedById: actorId(req) }
          : {}),
      };
      const [row] = await db.insert(table).values(values).returning();
      await recordRevision(entityType, Number(row.id), row as Record<string, unknown>, "create", actorId(req));
      await logActivity({
        actorUserId: actorId(req),
        action: "create",
        entityType,
        entityId: Number(row.id),
      });
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
    const schema = updateSchema.partial?.() ?? updateSchema;
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body", issues: parsed.error.issues });
      return;
    }
    try {
      const updateData: Record<string, unknown> = {
        ...parsed.data,
        updatedAt: new Date(),
      };
      if (trackActor) {
        updateData.updatedById = actorId(req);
      }
      const [row] = await db
        .update(table)
        .set(updateData)
        .where(eq(idColumn, id))
        .returning();
      if (!row) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      await recordRevision(entityType, id, row as Record<string, unknown>, "update", actorId(req));
      await logActivity({
        actorUserId: actorId(req),
        action: "update",
        entityType,
        entityId: id,
      });
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
      await logActivity({
        actorUserId: actorId(req),
        action: "delete",
        entityType,
        entityId: id,
      });
      res.json({ ok: true });
    } catch (err) {
      req.log.error({ err }, "delete failed");
      res.status(500).json({ error: "Internal error" });
    }
  });

  return router;
}
