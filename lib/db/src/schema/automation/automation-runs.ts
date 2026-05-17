import { pgTable, text, serial, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { automationRulesTable } from "./automation-rules";

export const automationRunsTable = pgTable(
  "automation_runs",
  {
    id: serial("id").primaryKey(),
    ruleId: integer("rule_id").references(() => automationRulesTable.id, { onDelete: "set null" }),
    status: text("status").notNull().default("pending"),
    triggerPayload: jsonb("trigger_payload").$type<Record<string, unknown>>().notNull().default({}),
    error: text("error"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [index("automation_runs_rule_idx").on(t.ruleId, t.startedAt)],
);

export const insertAutomationRunSchema = createInsertSchema(automationRunsTable).omit({
  id: true,
  startedAt: true,
});
export const selectAutomationRunSchema = createSelectSchema(automationRunsTable);
export type InsertAutomationRun = z.infer<typeof insertAutomationRunSchema>;
export type AutomationRun = typeof automationRunsTable.$inferSelect;
