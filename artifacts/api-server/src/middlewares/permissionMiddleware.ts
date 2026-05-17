import type { Request, Response, NextFunction } from "express";
import {
  getUserPermissions,
  hasPermission,
  type PermissionKey,
} from "../domains/users/permissions";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      permissions?: Set<PermissionKey>;
    }
  }
}

async function ensurePermissions(req: Request): Promise<Set<PermissionKey>> {
  if (!req.permissions) {
    req.permissions = req.isAdmin
      ? await getUserPermissions(req.userId)
      : new Set();
  }
  return req.permissions;
}

export function requirePermission(...keys: PermissionKey[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.isAdmin) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const perms = await ensurePermissions(req);
    if (keys.some((k) => hasPermission(perms, k))) {
      next();
      return;
    }
    res.status(403).json({ error: "Forbidden" });
  };
}

/** Backward-compatible: any authenticated admin session. */
export async function requireAdminOrPermission(
  req: Request,
  res: Response,
  next: NextFunction,
  ...keys: PermissionKey[]
): Promise<void> {
  if (!req.isAdmin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (keys.length === 0) {
    next();
    return;
  }
  const perms = await ensurePermissions(req);
  if (keys.some((k) => hasPermission(perms, k))) {
    next();
    return;
  }
  res.status(403).json({ error: "Forbidden" });
}
