import { eq, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  rolesTable,
  userRolesTable,
  moduleRegistryTable,
  taxonomyTermsTable,
  pageRegistryTable,
  blogPostsTable,
  customPagesTable,
  sitePagesTable,
  seoPagesTable,
} from "@workspace/db";
import { randomBytes, scryptSync } from "crypto";

function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

const BOOTSTRAP_EMAIL = "admin@precisefect.local";

async function main() {
  console.log("Seeding Phase 1 foundation...");

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn("ADMIN_PASSWORD not set; bootstrap user will have no password_hash until set.");
  }

  await db
    .insert(rolesTable)
    .values([
      { key: "super_admin", label: "Super Admin" },
      { key: "editor", label: "Editor" },
      { key: "viewer", label: "Viewer" },
    ])
    .onConflictDoNothing();

  const [superRole] = await db
    .select()
    .from(rolesTable)
    .where(eq(rolesTable.key, "super_admin"))
    .limit(1);

  let [adminUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, BOOTSTRAP_EMAIL))
    .limit(1);

  if (!adminUser) {
    [adminUser] = await db
      .insert(usersTable)
      .values({
        email: BOOTSTRAP_EMAIL,
        displayName: "Site Admin",
        passwordHash: adminPassword ? hashPassword(adminPassword) : null,
        isActive: true,
      })
      .returning();
  } else if (adminPassword && !adminUser.passwordHash) {
    [adminUser] = await db
      .update(usersTable)
      .set({ passwordHash: hashPassword(adminPassword) })
      .where(eq(usersTable.id, adminUser.id))
      .returning();
  }

  if (superRole && adminUser) {
    await db
      .insert(userRolesTable)
      .values({ userId: adminUser.id, roleId: superRole.id })
      .onConflictDoNothing();
  }

  await db
    .insert(moduleRegistryTable)
    .values([
      { key: "cms", label: "Content Management", isEnabled: true },
      { key: "leads", label: "Leads", isEnabled: true, config: {} },
      { key: "crm", label: "CRM", isEnabled: false, config: { status: "planned" } },
    ])
    .onConflictDoNothing();

  const categories = await db.select({ category: blogPostsTable.category }).from(blogPostsTable);
  const uniqueCategories = [...new Set(categories.map((c) => c.category).filter(Boolean))];
  for (const label of uniqueCategories) {
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await db
      .insert(taxonomyTermsTable)
      .values({ kind: "blog_category", slug, label })
      .onConflictDoNothing();
  }

  const customPages = await db.select().from(customPagesTable);
  for (const p of customPages) {
    await db
      .insert(pageRegistryTable)
      .values({
        path: `/p/${p.slug}`,
        title: p.title,
        sourceType: "custom_page",
        sourceId: p.id,
        isPublished: p.isPublished,
      })
      .onConflictDoNothing();
  }

  const sitePages = await db.select().from(sitePagesTable);
  for (const p of sitePages) {
    await db
      .insert(pageRegistryTable)
      .values({
        path: p.path,
        title: p.title,
        sourceType: "site_page",
        sourceId: p.id,
        isPublished: p.isPublished,
      })
      .onConflictDoNothing();
  }

  const seoRows = await db.select().from(seoPagesTable);
  for (const seo of seoRows) {
    const path = seo.slug.startsWith("/") ? seo.slug : `/${seo.slug}`;
    const [reg] = await db
      .insert(pageRegistryTable)
      .values({
        path,
        title: seo.metaTitle || path,
        sourceType: "seo",
        sourceId: seo.id,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: pageRegistryTable.path,
        set: { updatedAt: sql`now()` },
      })
      .returning();
    if (reg) {
      await db
        .update(seoPagesTable)
        .set({ pageRegistryId: reg.id })
        .where(eq(seoPagesTable.id, seo.id));
    }
  }

  console.log("Foundation seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
