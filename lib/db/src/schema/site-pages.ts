import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sitePagesTable = pgTable("site_pages", {
  id: serial("id").primaryKey(),
  path: text("path").notNull().unique(),
  title: text("title").notNull(),
  heroEyebrow: text("hero_eyebrow").notNull().default(""),
  heroHeadline: text("hero_headline").notNull().default(""),
  heroSubheadline: text("hero_subheadline").notNull().default(""),
  bodyContent: text("body_content").notNull().default(""),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSitePageSchema = createInsertSchema(sitePagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectSitePageSchema = createSelectSchema(sitePagesTable);
export type InsertSitePage = z.infer<typeof insertSitePageSchema>;
export type SitePage = typeof sitePagesTable.$inferSelect;
