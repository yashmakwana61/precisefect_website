import { pgTable, text, serial, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users/users";

export const contentRevisionsTable = pgTable(
  "content_revisions",
  {
    id: serial("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    operation: text("operation").notNull().default("update"),
    createdBy: text("created_by").notNull().default("admin"),
    createdById: integer("created_by_id").references(() => usersTable.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("content_revisions_entity_idx").on(t.entityType, t.entityId, t.createdAt),
  ],
);

export const insertContentRevisionSchema = createInsertSchema(contentRevisionsTable).omit({
  id: true,
  createdAt: true,
});
export const selectContentRevisionSchema = createSelectSchema(contentRevisionsTable);
export type InsertContentRevision = z.infer<typeof insertContentRevisionSchema>;
export type ContentRevision = typeof contentRevisionsTable.$inferSelect;
