import { Router, type IRouter } from "express";
import { z } from "zod";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL,
  createSessionToken,
} from "../middlewares/authMiddleware";

const router: IRouter = Router();

const loginBody = z.object({ password: z.string().min(1) });

router.post("/auth/login", (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    req.log.error("ADMIN_PASSWORD env var is not set");
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }
  if (parsed.data.password !== expected) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = createSessionToken();
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
  res.json({ ok: true });
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  res.json({ isAdmin: req.isAdmin });
});

export default router;
