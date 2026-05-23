import { Router, type IRouter } from "express";
import { pingDatabase } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  try {
    await pingDatabase();
    res.json({ status: "ok", db: "ok" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(503).json({ status: "degraded", db: "error", detail: message });
  }
});

export default router;
