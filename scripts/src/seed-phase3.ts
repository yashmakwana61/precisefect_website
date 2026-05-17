import { eq } from "drizzle-orm";
import {
  db,
  permissionsTable,
  rolePermissionsTable,
  rolesTable,
  automationRulesTable,
  moduleRegistryTable,
} from "@workspace/db";

const PERMISSIONS: Array<{ key: string; label: string }> = [
  { key: "leads:read", label: "Read assigned leads" },
  { key: "leads:read_all", label: "Read all leads" },
  { key: "leads:write", label: "Update leads" },
  { key: "leads:assign", label: "Assign leads" },
  { key: "content:read", label: "Read content" },
  { key: "content:write", label: "Edit content" },
  { key: "system:read", label: "View system data" },
  { key: "system:write", label: "Manage system data" },
  { key: "automation:read", label: "View automation rules" },
  { key: "automation:write", label: "Manage automation rules" },
  { key: "settings:write", label: "Edit site settings" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: PERMISSIONS.map((p) => p.key),
  editor: ["content:read", "content:write", "system:read", "leads:read_all", "leads:read"],
  viewer: ["content:read", "system:read", "leads:read_all", "leads:read"],
  sales: ["leads:read", "leads:write", "leads:assign", "system:read"],
};

async function main() {
  console.log("Seeding Phase 3 (permissions + automation)...");

  for (const p of PERMISSIONS) {
    await db.insert(permissionsTable).values(p).onConflictDoNothing();
  }

  await db
    .insert(rolesTable)
    .values([
      { key: "admin", label: "Admin" },
      { key: "sales", label: "Sales" },
    ])
    .onConflictDoNothing();

  const allPerms = await db.select().from(permissionsTable);
  const permByKey = new Map(allPerms.map((p) => [p.key, p.id]));
  const allRoles = await db.select().from(rolesTable);
  const roleByKey = new Map(allRoles.map((r) => [r.key, r.id]));

  for (const [roleKey, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleByKey.get(roleKey);
    if (!roleId) continue;
    for (const pk of permKeys) {
      const permissionId = permByKey.get(pk);
      if (!permissionId) continue;
      await db
        .insert(rolePermissionsTable)
        .values({ roleId, permissionId })
        .onConflictDoNothing();
    }
  }

  const adminRoleId = roleByKey.get("admin");
  if (adminRoleId) {
    for (const p of allPerms) {
      await db
        .insert(rolePermissionsTable)
        .values({ roleId: adminRoleId, permissionId: p.id })
        .onConflictDoNothing();
    }
  }

  await db
    .insert(moduleRegistryTable)
    .values({ key: "automation", label: "Workflow Automation", isEnabled: true, config: {} })
    .onConflictDoUpdate({
      target: moduleRegistryTable.key,
      set: { isEnabled: true, label: "Workflow Automation" },
    });

  const existing = await db
    .select({ id: automationRulesTable.id })
    .from(automationRulesTable)
    .where(eq(automationRulesTable.triggerEvent, "lead.created"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(automationRulesTable).values({
      name: "Notify on new lead",
      enabled: true,
      triggerType: "event",
      triggerEvent: "lead.created",
      conditions: {},
      actions: [{ type: "email", template: "new_lead" }],
      moduleKey: "leads",
    });
    console.log("Created default lead.created automation rule.");
  }

  console.log("Phase 3 seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
