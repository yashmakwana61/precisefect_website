import { pgTable, text, serial, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { integrationConnectionsTable } from "./integration-connections";

export const integrationDeliveryLogTable = pgTable(
  "integration_delivery_log",
  {
    id: serial("id").primaryKey(),
    connectionId: integer("connection_id").references(() => integrationConnectionsTable.id, {
      onDelete: "set null",
    }),
    direction: text("direction").notNull(),
    eventType: text("event_type").notNull().default(""),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    status: text("status").notNull().default("pending"),
    httpStatus: integer("http_status"),
    error: text("error"),
    attempts: integer("attempts").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("integration_delivery_connection_idx").on(t.connectionId, t.createdAt),
    index("integration_delivery_status_idx").on(t.status, t.createdAt),
  ],
);

export const insertIntegrationDeliveryLogSchema = createInsertSchema(
  integrationDeliveryLogTable,
).omit({ id: true, createdAt: true });
export const selectIntegrationDeliveryLogSchema = createSelectSchema(
  integrationDeliveryLogTable,
);
export type InsertIntegrationDeliveryLog = z.infer<typeof insertIntegrationDeliveryLogSchema>;
export type IntegrationDeliveryLog = typeof integrationDeliveryLogTable.$inferSelect;
