import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "../users/users";

export const integrationConnectionsTable = pgTable("integration_connections", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  label: text("label").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(true),
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  secretsEnc: text("secrets_enc"),
  inboundToken: text("inbound_token"),
  createdById: integer("created_by_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertIntegrationConnectionSchema = createInsertSchema(
  integrationConnectionsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export const selectIntegrationConnectionSchema = createSelectSchema(
  integrationConnectionsTable,
);
export type InsertIntegrationConnection = z.infer<typeof insertIntegrationConnectionSchema>;
export type IntegrationConnection = typeof integrationConnectionsTable.$inferSelect;
