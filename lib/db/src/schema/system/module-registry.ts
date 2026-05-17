import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const moduleRegistryTable = pgTable("module_registry", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(true),
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertModuleRegistrySchema = createInsertSchema(moduleRegistryTable).omit({
  id: true,
  updatedAt: true,
});
export const selectModuleRegistrySchema = createSelectSchema(moduleRegistryTable);
export type InsertModuleRegistry = z.infer<typeof insertModuleRegistrySchema>;
export type ModuleRegistry = typeof moduleRegistryTable.$inferSelect;
