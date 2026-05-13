import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteBlocksTable = pgTable("site_blocks", {
  id: serial("id").primaryKey(),
  blockType: text("block_type").notNull().unique(),
  content: jsonb("content").notNull().default({}),
  isPublished: boolean("is_published").notNull().default(true),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSiteBlockSchema = createInsertSchema(siteBlocksTable).omit({
  id: true,
  updatedAt: true,
});
export const selectSiteBlockSchema = createSelectSchema(siteBlocksTable);
export type InsertSiteBlock = z.infer<typeof insertSiteBlockSchema>;
export type SiteBlock = typeof siteBlocksTable.$inferSelect;
