import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
  index,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "../users/users";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
]);

export const leadSourceEnum = pgEnum("lead_source", [
  "contact_form",
  "whatsapp",
  "manual",
  "referral",
  "other",
]);

export const leadsTable = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    company: text("company").notNull().default(""),
    businessType: text("business_type").notNull().default(""),
    message: text("message").notNull(),
    source: leadSourceEnum("source").notNull().default("contact_form"),
    sourceDetail: text("source_detail").notNull().default(""),
    status: leadStatusEnum("status").notNull().default("new"),
    assignedToId: integer("assigned_to_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    priority: text("priority").notNull().default("normal"),
    score: integer("score").notNull().default(0),
    scoreBreakdown: jsonb("score_breakdown")
      .$type<Record<string, number>>()
      .notNull()
      .default({}),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent").notNull().default(""),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_status_created_idx").on(t.status, t.createdAt),
    index("leads_assigned_idx").on(t.assignedToId),
    index("leads_is_read_idx").on(t.isRead),
  ],
);

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectLeadSchema = createSelectSchema(leadsTable);
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  "contact_form",
  "whatsapp",
  "manual",
  "referral",
  "other",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
