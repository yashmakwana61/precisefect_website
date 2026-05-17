import { Router, type IRouter, type Request, type Response } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  activityEventsTable,
  moduleRegistryTable,
  usersTable,
  rolesTable,
  userRolesTable,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";

const router: IRouter = Router();

router.get("/system/modules", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(moduleRegistryTable).orderBy(moduleRegistryTable.key);
    res.json(rows);
  } catch (err) {
    _req.log.error({ err }, "modules list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/system/activity", requireAdmin, async (req: Request, res: Response) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  try {
    const rows = await db
      .select()
      .from(activityEventsTable)
      .orderBy(desc(activityEventsTable.createdAt))
      .limit(limit);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "activity list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/system/users", requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        displayName: usersTable.displayName,
        isActive: usersTable.isActive,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(usersTable.email);

    const roleRows = await db
      .select({
        userId: userRolesTable.userId,
        roleKey: rolesTable.key,
        roleLabel: rolesTable.label,
      })
      .from(userRolesTable)
      .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));

    const rolesByUser = new Map<number, Array<{ key: string; label: string }>>();
    for (const r of roleRows) {
      const list = rolesByUser.get(r.userId) ?? [];
      list.push({ key: r.roleKey, label: r.roleLabel });
      rolesByUser.set(r.userId, list);
    }

    res.json(
      users.map((u) => ({
        ...u,
        roles: rolesByUser.get(u.id) ?? [],
      })),
    );
  } catch (err) {
    req.log.error({ err }, "users list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
