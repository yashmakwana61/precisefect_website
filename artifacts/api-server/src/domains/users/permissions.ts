import { eq } from "drizzle-orm";
import {
  db,
  permissionsTable,
  rolePermissionsTable,
  userRolesTable,
  rolesTable,
} from "@workspace/db";

export const PERMISSION_KEYS = [
  "leads:read",
  "leads:read_all",
  "leads:write",
  "leads:assign",
  "content:read",
  "content:write",
  "system:read",
  "system:write",
  "automation:read",
  "automation:write",
  "settings:write",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

const SUPER_ROLES = new Set(["super_admin", "admin"]);

export async function getUserPermissions(userId: number | null): Promise<Set<PermissionKey>> {
  if (userId == null) {
    return new Set(PERMISSION_KEYS);
  }

  const roleRows = await db
    .select({ roleKey: rolesTable.key })
    .from(userRolesTable)
    .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
    .where(eq(userRolesTable.userId, userId));

  if (roleRows.some((r) => SUPER_ROLES.has(r.roleKey))) {
    return new Set(PERMISSION_KEYS);
  }

  const permRows = await db
    .select({ key: permissionsTable.key })
    .from(userRolesTable)
    .innerJoin(rolePermissionsTable, eq(userRolesTable.roleId, rolePermissionsTable.roleId))
    .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
    .where(eq(userRolesTable.userId, userId));

  const set = new Set<PermissionKey>();
  for (const row of permRows) {
    if (PERMISSION_KEYS.includes(row.key as PermissionKey)) {
      set.add(row.key as PermissionKey);
    }
  }
  return set;
}

export function hasPermission(
  permissions: Set<PermissionKey>,
  key: PermissionKey,
): boolean {
  return permissions.has(key);
}

export function canReadLead(
  permissions: Set<PermissionKey>,
  lead: { assignedToId: number | null },
  userId: number | null,
): boolean {
  if (hasPermission(permissions, "leads:read_all")) return true;
  if (!hasPermission(permissions, "leads:read")) return false;
  if (userId == null) return true;
  return lead.assignedToId === userId || lead.assignedToId === null;
}

export function canWriteLead(
  permissions: Set<PermissionKey>,
  lead: { assignedToId: number | null },
  userId: number | null,
): boolean {
  if (!hasPermission(permissions, "leads:write")) return false;
  if (hasPermission(permissions, "leads:read_all")) return true;
  if (userId == null) return true;
  return lead.assignedToId === userId || lead.assignedToId === null;
}
