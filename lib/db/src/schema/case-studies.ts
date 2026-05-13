import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const caseStudyMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.enum(["TrendingUp", "Clock", "BarChart", "Zap", "Shield", "Users"]).default("TrendingUp"),
});
export type CaseStudyMetric = z.infer<typeof caseStudyMetricSchema>;

export const caseStudiesTable = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  client: text("client").notNull(),
  industry: text("industry").notNull(),
  title: text("title").notNull(),
  problem: text("problem").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  metrics: jsonb("metrics").$type<CaseStudyMetric[]>().notNull().default([]),
  sortOrder: serial("sort_order"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCaseStudySchema = createInsertSchema(caseStudiesTable, {
  metrics: z.array(caseStudyMetricSchema),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sortOrder: true,
});
export const selectCaseStudySchema = createSelectSchema(caseStudiesTable);
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudiesTable.$inferSelect;
