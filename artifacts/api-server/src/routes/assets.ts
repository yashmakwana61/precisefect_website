import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { eq, ilike, desc } from "drizzle-orm";
import { db, assetsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";
import { getSupabase, getStorageBucket, getPublicAssetUrl } from "../lib/supabase";

const router: IRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/assets", requireAdmin, async (req: Request, res: Response) => {
  const query = String(req.query.query ?? "").trim();
  try {
    const base = db.select().from(assetsTable).$dynamic();
    const rows = query
      ? await base
          .where(ilike(assetsTable.filename, `%${query}%`))
          .orderBy(desc(assetsTable.createdAt))
      : await base.orderBy(desc(assetsTable.createdAt));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "assets list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.post(
  "/assets/upload",
  requireAdmin,
  upload.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "file required" });
      return;
    }
    try {
      const supabase = getSupabase();
      const bucket = getStorageBucket();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${Date.now()}-${safeName}`;

      const { error } = await supabase.storage.from(bucket).upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
      if (error) {
        req.log.error({ err: error }, "supabase upload failed");
        res.status(500).json({ error: error.message });
        return;
      }

      const publicUrl = getPublicAssetUrl(storagePath);
      const [row] = await db
        .insert(assetsTable)
        .values({
          filename: safeName,
          storagePath,
          publicUrl,
          mimeType: file.mimetype,
          sizeBytes: file.size,
        })
        .returning();

      res.status(201).json(row);
    } catch (err) {
      req.log.error({ err }, "asset upload failed");
      res.status(500).json({ error: "Internal error" });
    }
  },
);

router.delete("/assets/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.id, id)).limit(1);
    if (!asset) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const supabase = getSupabase();
    await supabase.storage.from(getStorageBucket()).remove([asset.storagePath]);
    await db.delete(assetsTable).where(eq(assetsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "asset delete failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
