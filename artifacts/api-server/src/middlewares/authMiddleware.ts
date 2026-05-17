import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const SESSION_COOKIE = "psf_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: number;
  displayName: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      isAdmin: boolean;
      userId: number | null;
      user: SessionUser | null;
    }
  }
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET must be set");
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function createSessionToken(userId?: number | null): string {
  const expires = Date.now() + SESSION_TTL_MS;
  if (userId != null) {
    const payload = `user.${userId}.${expires}`;
    return `${payload}.${sign(payload)}`;
  }
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): {
  isAdmin: boolean;
  userId: number | null;
} {
  if (!token) return { isAdmin: false, userId: null };
  const parts = token.split(".");
  if (parts.length !== 3 && parts.length !== 4) {
    return { isAdmin: false, userId: null };
  }

  if (parts[0] === "admin" && parts.length === 3) {
    const [, expiresStr, sig] = parts;
    const expires = Number(expiresStr);
    if (!Number.isFinite(expires) || Date.now() > expires) {
      return { isAdmin: false, userId: null };
    }
    const payload = `admin.${expiresStr}`;
    if (!safeEqual(sig, sign(payload))) return { isAdmin: false, userId: null };
    return { isAdmin: true, userId: null };
  }

  if (parts[0] === "user" && parts.length === 4) {
    const [, userIdStr, expiresStr, sig] = parts;
    const userId = Number(userIdStr);
    const expires = Number(expiresStr);
    if (!Number.isFinite(userId) || !Number.isFinite(expires) || Date.now() > expires) {
      return { isAdmin: false, userId: null };
    }
    const payload = `user.${userIdStr}.${expiresStr}`;
    if (!safeEqual(sig, sign(payload))) return { isAdmin: false, userId: null };
    return { isAdmin: true, userId };
  }

  return { isAdmin: false, userId: null };
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_TTL = SESSION_TTL_MS;

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[SESSION_COOKIE];
  const session = verifySessionToken(token);
  req.isAdmin = session.isAdmin;
  req.userId = session.userId;
  req.user =
    session.userId != null
      ? { id: session.userId, displayName: "Admin" }
      : null;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
