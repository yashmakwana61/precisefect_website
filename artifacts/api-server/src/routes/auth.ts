import { Router, type IRouter } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  SESSION_COOKIE_NAME,
  SESSION_TTL,
  createSessionToken,
} from "../middlewares/authMiddleware";
import { authenticatePassword, getUserRoleKeys } from "../domains/users/auth.service";
import { getUserPermissions, PERMISSION_KEYS } from "../domains/users/permissions";
import { checkRateLimit, clientIp } from "../lib/rate-limit";

const router: IRouter = Router();

const loginBody = z.object({
  password: z.string().min(1),
  email: z.string().email().optional(),
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const ip = clientIp(req);
  const rl = checkRateLimit(`auth:login:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.allowed) {
    res.status(429).json({ error: "Too many attempts", retryAfterSec: rl.retryAfterSec });
    return;
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    req.log.error("ADMIN_PASSWORD env var is not set");
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }

  const auth = await authenticatePassword(parsed.data.password, parsed.data.email);
  if (!auth) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = createSessionToken(auth.userId);
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL,
  });
  res.json({ ok: true, userId: auth.userId, displayName: auth.displayName });
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get("/auth/me", async (req, res) => {
  let displayName: string | null = null;
  let roles: string[] = [];
  let permissions: string[] = [];

  if (req.isAdmin) {
    if (req.userId != null) {
      const [row] = await db
        .select({ displayName: usersTable.displayName })
        .from(usersTable)
        .where(eq(usersTable.id, req.userId))
        .limit(1);
      displayName = row?.displayName ?? null;
      roles = await getUserRoleKeys(req.userId);
    } else {
      displayName = "Admin";
      roles = ["super_admin"];
    }
    const permSet = await getUserPermissions(req.userId);
    permissions = [...permSet];
    if (permissions.length === 0 && req.isAdmin) {
      permissions = [...PERMISSION_KEYS];
    }
  }

  res.json({
    isAdmin: req.isAdmin,
    userId: req.userId,
    displayName: displayName ?? (req.isAdmin ? "Admin" : null),
    roles,
    permissions,
  });
});

export default router;
