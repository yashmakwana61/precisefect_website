import { eq } from "drizzle-orm";
import { db, usersTable, userRolesTable, rolesTable } from "@workspace/db";
import { verifyPassword } from "../../lib/password";
import { secureCompare } from "../../lib/secure-compare";

const BOOTSTRAP_EMAIL = "admin@precisefect.local";

export async function authenticatePassword(
  plain: string,
  email?: string,
): Promise<{
  userId: number | null;
  displayName: string;
} | null> {
  const envPassword = process.env.ADMIN_PASSWORD ?? "";
  const envMatch = envPassword.length > 0 && secureCompare(plain, envPassword);

  if (email) {
    const normalized = email.trim().toLowerCase();
    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, normalized))
        .limit(1);
      if (user?.isActive && user.passwordHash && verifyPassword(plain, user.passwordHash)) {
        return { userId: user.id, displayName: user.displayName };
      }
    } catch {
      // users table unavailable
    }
    return null;
  }

  let bootstrap: typeof usersTable.$inferSelect | undefined;
  try {
    [bootstrap] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, BOOTSTRAP_EMAIL))
      .limit(1);
  } catch {
    bootstrap = undefined;
  }

  if (bootstrap?.passwordHash && verifyPassword(plain, bootstrap.passwordHash)) {
    return { userId: bootstrap.id, displayName: bootstrap.displayName };
  }

  if (envMatch) {
    try {
      const user = await findBootstrapUser();
      return { userId: user?.id ?? null, displayName: user?.displayName ?? "Admin" };
    } catch {
      return { userId: null, displayName: "Admin" };
    }
  }

  return null;
}

async function findBootstrapUser() {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, BOOTSTRAP_EMAIL))
    .limit(1);
  return user ?? null;
}

export async function getUserRoleKeys(userId: number): Promise<string[]> {
  const rows = await db
    .select({ key: rolesTable.key })
    .from(userRolesTable)
    .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
    .where(eq(userRolesTable.userId, userId));
  return rows.map((r) => r.key);
}

export async function userIsAdmin(userId: number): Promise<boolean> {
  const keys = await getUserRoleKeys(userId);
  return keys.includes("super_admin") || keys.includes("editor");
}
