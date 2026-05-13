import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentRevisionsTable = pgTable("content_revisions", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  operation: text("operation").notNull().default("update"),
  createdBy: text("created_by").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContentRevisionSchema = createInsertSchema(contentRevisionsTable).omit({
  id: true,
  createdAt: true,
});
export const selectContentRevisionSchema = createSelectSchema(contentRevisionsTable);
export type InsertContentRevision = z.infer<typeof insertContentRevisionSchema>;
export type ContentRevision = typeof contentRevisionsTable.$inferSelect;
