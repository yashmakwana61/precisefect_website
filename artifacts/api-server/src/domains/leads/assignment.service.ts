import { and, asc, eq, inArray } from "drizzle-orm";
import {
  db,
  usersTable,
  userRolesTable,
  rolesTable,
  moduleRegistryTable,
} from "@workspace/db";

const ASSIGNABLE_ROLES = ["sales", "admin", "super_admin"];

export async function pickRoundRobinAssignee(): Promise<number | null> {
  const roleRows = await db
    .select({ id: rolesTable.id })
    .from(rolesTable)
    .where(inArray(rolesTable.key, ASSIGNABLE_ROLES));

  if (roleRows.length === 0) return null;

  const roleIds = roleRows.map((r) => r.id);
  const candidates = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .innerJoin(userRolesTable, eq(userRolesTable.userId, usersTable.id))
    .where(and(eq(usersTable.isActive, true), inArray(userRolesTable.roleId, roleIds)))
    .orderBy(asc(usersTable.id));

  const uniqueIds = [...new Set(candidates.map((c) => c.id))];
  if (uniqueIds.length === 0) return null;

  const [mod] = await db
    .select()
    .from(moduleRegistryTable)
    .where(eq(moduleRegistryTable.key, "leads"))
    .limit(1);

  const config = (mod?.config ?? {}) as { lastAssignedUserId?: number };
  const lastId = config.lastAssignedUserId;
  let nextId = uniqueIds[0];
  if (lastId != null) {
    const idx = uniqueIds.indexOf(lastId);
    nextId = uniqueIds[(idx + 1) % uniqueIds.length];
  }

  await db
    .update(moduleRegistryTable)
    .set({
      config: { ...config, lastAssignedUserId: nextId },
      updatedAt: new Date(),
    })
    .where(eq(moduleRegistryTable.key, "leads"));

  return nextId;
}
