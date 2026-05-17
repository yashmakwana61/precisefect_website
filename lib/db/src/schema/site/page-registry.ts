import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pageRegistryTable = pgTable("page_registry", {
  id: serial("id").primaryKey(),
  path: text("path").notNull().unique(),
  title: text("title").notNull(),
  sourceType: text("source_type").notNull(),
  sourceId: integer("source_id"),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPageRegistrySchema = createInsertSchema(pageRegistryTable).omit({
  id: true,
  updatedAt: true,
});
export const selectPageRegistrySchema = createSelectSchema(pageRegistryTable);
export type InsertPageRegistry = z.infer<typeof insertPageRegistrySchema>;
export type PageRegistry = typeof pageRegistryTable.$inferSelect;
