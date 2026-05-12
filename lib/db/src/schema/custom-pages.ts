import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customPagesTable = pgTable("custom_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  pageType: text("page_type").notNull().default("landing"),
  heroHeadline: text("hero_headline").notNull().default(""),
  heroSubheadline: text("hero_subheadline").notNull().default(""),
  heroCtaText: text("hero_cta_text").notNull().default(""),
  heroCtaUrl: text("hero_cta_url").notNull().default(""),
  bodyContent: text("body_content").notNull().default(""),
  listItems: jsonb("list_items").notNull().default([]),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCustomPageSchema = createInsertSchema(customPagesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const selectCustomPageSchema = createSelectSchema(customPagesTable);
export type InsertCustomPage = z.infer<typeof insertCustomPageSchema>;
export type CustomPage = typeof customPagesTable.$inferSelect;
