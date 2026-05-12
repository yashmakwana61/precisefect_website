import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const seoPagesTable = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  ogTitle: text("og_title").notNull().default(""),
  ogDescription: text("og_description").notNull().default(""),
  ogImageUrl: text("og_image_url").notNull().default(""),
  canonicalUrl: text("canonical_url").notNull().default(""),
  noIndex: boolean("no_index").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSeoPageSchema = createInsertSchema(seoPagesTable).omit({ id: true, updatedAt: true });
export const selectSeoPageSchema = createSelectSchema(seoPagesTable);
export type InsertSeoPage = z.infer<typeof insertSeoPageSchema>;
export type SeoPage = typeof seoPagesTable.$inferSelect;
