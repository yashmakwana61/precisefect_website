import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobOpeningsTable = pgTable("job_openings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull().default("Full-time"),
  description: text("description").notNull(),
  applyUrl: text("apply_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJobOpeningSchema = createInsertSchema(jobOpeningsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectJobOpeningSchema = createSelectSchema(jobOpeningsTable);
export type InsertJobOpening = z.infer<typeof insertJobOpeningSchema>;
export type JobOpening = typeof jobOpeningsTable.$inferSelect;
