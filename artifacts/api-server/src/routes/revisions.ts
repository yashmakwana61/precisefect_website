import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, contentRevisionsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/revisions", requireAdmin, async (req: Request, res: Response) => {
  const entityType = String(req.query.entityType ?? "");
  const entityId = Number(req.query.entityId);
  if (!entityType || !Number.isFinite(entityId)) {
    res.status(400).json({ error: "entityType and entityId required" });
    return;
  }
  try {
    const rows = await db
      .select()
      .from(contentRevisionsTable)
      .where(
        and(
          eq(contentRevisionsTable.entityType, entityType),
          eq(contentRevisionsTable.entityId, entityId),
        ),
      )
      .orderBy(desc(contentRevisionsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "revisions list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/revisions/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db
      .select()
      .from(contentRevisionsTable)
      .where(eq(contentRevisionsTable.id, id))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "revision get failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
