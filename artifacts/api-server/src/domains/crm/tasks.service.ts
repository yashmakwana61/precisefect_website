import { and, asc, count, desc, eq, gte, lte, or, sql, type SQL } from "drizzle-orm";
import { db, crmTasksTable, leadsTable, usersTable } from "@workspace/db";
import { logActivity } from "../system/activity.service";
import type { z } from "zod";
import type { createTaskSchema, updateTaskSchema } from "./tasks.schemas";

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export async function listTasksForLead(leadId: number) {
  return db
    .select({
      id: crmTasksTable.id,
      leadId: crmTasksTable.leadId,
      title: crmTasksTable.title,
      dueAt: crmTasksTable.dueAt,
      completedAt: crmTasksTable.completedAt,
      type: crmTasksTable.type,
      status: crmTasksTable.status,
      assignedToId: crmTasksTable.assignedToId,
      createdAt: crmTasksTable.createdAt,
      assigneeName: usersTable.displayName,
    })
    .from(crmTasksTable)
    .leftJoin(usersTable, eq(crmTasksTable.assignedToId, usersTable.id))
    .where(eq(crmTasksTable.leadId, leadId))
    .orderBy(asc(crmTasksTable.dueAt), desc(crmTasksTable.createdAt));
}

export async function listTasks(query: {
  status?: "open" | "done" | "cancelled";
  due?: "today" | "overdue";
  assignedToId?: number | null;
  limit?: number;
}) {
  const conditions: SQL[] = [];
  if (query.status) {
    conditions.push(eq(crmTasksTable.status, query.status));
  } else {
    conditions.push(eq(crmTasksTable.status, "open"));
  }

  if (query.assignedToId != null) {
    conditions.push(eq(crmTasksTable.assignedToId, query.assignedToId));
  }

  const now = new Date();
  if (query.due === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    conditions.push(
      and(
        sql`${crmTasksTable.dueAt} IS NOT NULL`,
        gte(crmTasksTable.dueAt, start),
        lte(crmTasksTable.dueAt, end),
      )!,
    );
  } else if (query.due === "overdue") {
    conditions.push(
      and(sql`${crmTasksTable.dueAt} IS NOT NULL`, lte(crmTasksTable.dueAt, now))!,
    );
  }

  const limit = Math.min(100, Math.max(1, query.limit ?? 50));
  const base = db
    .select({
      id: crmTasksTable.id,
      leadId: crmTasksTable.leadId,
      title: crmTasksTable.title,
      dueAt: crmTasksTable.dueAt,
      type: crmTasksTable.type,
      status: crmTasksTable.status,
      assignedToId: crmTasksTable.assignedToId,
      leadName: leadsTable.name,
      assigneeName: usersTable.displayName,
    })
    .from(crmTasksTable)
    .innerJoin(leadsTable, eq(crmTasksTable.leadId, leadsTable.id))
    .leftJoin(usersTable, eq(crmTasksTable.assignedToId, usersTable.id))
    .$dynamic();

  if (conditions.length > 0) {
    base.where(and(...conditions));
  }

  return base.orderBy(asc(crmTasksTable.dueAt)).limit(limit);
}

export async function getTaskDashboard(actorUserId: number | null) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const openCond = eq(crmTasksTable.status, "open");
  const assignCond =
    actorUserId != null ? eq(crmTasksTable.assignedToId, actorUserId) : undefined;

  const baseWhere = assignCond ? and(openCond, assignCond) : openCond;

  const [dueTodayRow] = await db
    .select({ total: count() })
    .from(crmTasksTable)
    .where(
      and(
        baseWhere,
        sql`${crmTasksTable.dueAt} IS NOT NULL`,
        gte(crmTasksTable.dueAt, start),
        lte(crmTasksTable.dueAt, end),
      ),
    );

  const [overdueRow] = await db
    .select({ total: count() })
    .from(crmTasksTable)
    .where(and(baseWhere, sql`${crmTasksTable.dueAt} IS NOT NULL`, lte(crmTasksTable.dueAt, now)));

  const tasks = await listTasks({
    status: "open",
    due: "today",
    assignedToId: actorUserId ?? undefined,
    limit: 10,
  });

  return {
    dueToday: Number(dueTodayRow?.total ?? 0),
    overdue: Number(overdueRow?.total ?? 0),
    tasks,
  };
}

export async function createTask(
  leadId: number,
  input: CreateTaskInput,
  actorUserId: number | null,
) {
  const [lead] = await db.select({ id: leadsTable.id }).from(leadsTable).where(eq(leadsTable.id, leadId)).limit(1);
  if (!lead) return null;

  const [task] = await db
    .insert(crmTasksTable)
    .values({
      leadId,
      title: input.title,
      dueAt: input.dueAt ? new Date(input.dueAt) : null,
      type: input.type ?? "follow_up",
      assignedToId: input.assignedToId ?? actorUserId,
      createdById: actorUserId,
    })
    .returning();

  await logActivity({
    actorUserId,
    action: "task.created",
    entityType: "leads",
    entityId: leadId,
    metadata: { taskId: task.id, title: task.title },
  });

  return task;
}

export async function updateTask(
  taskId: number,
  input: UpdateTaskInput,
  actorUserId: number | null,
) {
  const patch: Partial<typeof crmTasksTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.title != null) patch.title = input.title;
  if (input.dueAt !== undefined) patch.dueAt = input.dueAt ? new Date(input.dueAt) : null;
  if (input.assignedToId !== undefined) patch.assignedToId = input.assignedToId;
  if (input.status != null) {
    patch.status = input.status;
    patch.completedAt = input.status === "done" ? new Date() : null;
  }

  const [task] = await db
    .update(crmTasksTable)
    .set(patch)
    .where(eq(crmTasksTable.id, taskId))
    .returning();

  if (!task) return null;

  await logActivity({
    actorUserId,
    action: input.status === "done" ? "task.completed" : "task.updated",
    entityType: "leads",
    entityId: task.leadId,
    metadata: { taskId: task.id },
  });

  return task;
}

export async function getTaskById(taskId: number) {
  const [task] = await db
    .select()
    .from(crmTasksTable)
    .where(eq(crmTasksTable.id, taskId))
    .limit(1);
  return task ?? null;
}
