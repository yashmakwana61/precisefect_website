import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { leadsTable } from "../leads/leads";
import { usersTable } from "../users/users";

export const crmTaskStatusEnum = pgEnum("crm_task_status", ["open", "done", "cancelled"]);
export const crmTaskTypeEnum = pgEnum("crm_task_type", [
  "call",
  "email",
  "follow_up",
  "custom",
]);

export const crmTasksTable = pgTable(
  "crm_tasks",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id")
      .notNull()
      .references(() => leadsTable.id, { onDelete: "cascade" }),
    assignedToId: integer("assigned_to_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    createdById: integer("created_by_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    type: crmTaskTypeEnum("type").notNull().default("follow_up"),
    status: crmTaskStatusEnum("status").notNull().default("open"),
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("crm_tasks_lead_idx").on(t.leadId, t.status),
    index("crm_tasks_due_idx").on(t.dueAt, t.status),
    index("crm_tasks_assigned_idx").on(t.assignedToId, t.status),
  ],
);

export const insertCrmTaskSchema = createInsertSchema(crmTasksTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  reminderSentAt: true,
});
export const selectCrmTaskSchema = createSelectSchema(crmTasksTable);
export type InsertCrmTask = z.infer<typeof insertCrmTaskSchema>;
export type CrmTask = typeof crmTasksTable.$inferSelect;
