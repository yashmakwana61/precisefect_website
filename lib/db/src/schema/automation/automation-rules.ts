import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type AutomationActionConfig = {
  type: string;
  template?: string;
  field?: string;
  value?: unknown;
  mode?: string;
  userId?: number;
  url?: string;
  title?: string;
  dueInDays?: number;
  connectionId?: number;
};

export const automationRulesTable = pgTable(
  "automation_rules",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    enabled: boolean("enabled").notNull().default(true),
    triggerType: text("trigger_type").notNull().default("event"),
    triggerEvent: text("trigger_event").notNull(),
    triggerSchedule: text("trigger_schedule"),
    conditions: jsonb("conditions").$type<Record<string, unknown>>().notNull().default({}),
    actions: jsonb("actions").$type<AutomationActionConfig[]>().notNull().default([]),
    moduleKey: text("module_key").notNull().default("leads"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("automation_rules_trigger_idx").on(t.triggerType, t.triggerEvent, t.enabled),
  ],
);

export const insertAutomationRuleSchema = createInsertSchema(automationRulesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectAutomationRuleSchema = createSelectSchema(automationRulesTable);
export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type AutomationRule = typeof automationRulesTable.$inferSelect;
