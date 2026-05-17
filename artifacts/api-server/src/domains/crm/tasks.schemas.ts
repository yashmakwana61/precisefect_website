import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  dueAt: z.string().min(1).optional().nullable(),
  type: z.enum(["call", "email", "follow_up", "custom"]).optional(),
  assignedToId: z.number().int().positive().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  dueAt: z.string().min(1).nullable().optional(),
  status: z.enum(["open", "done", "cancelled"]).optional(),
  assignedToId: z.number().int().positive().nullable().optional(),
});
