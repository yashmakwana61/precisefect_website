import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "@workspace/db";

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(10).max(30),
  businessType: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(5000),
  company: z.string().trim().max(120).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  sourceDetail: z.string().trim().max(500).optional(),
  website: z.string().max(0).optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  assignedToId: z.number().int().positive().nullable().optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
  isRead: z.boolean().optional(),
  company: z.string().trim().max(120).optional(),
});

export const createLeadNoteSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

export const adminCreateLeadSchema = createLeadSchema.extend({
  source: z.enum(LEAD_SOURCES).default("manual"),
});
