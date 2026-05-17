import { createHash } from "crypto";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import {
  db,
  leadsTable,
  leadNotesTable,
  usersTable,
  activityEventsTable,
  type Lead,
  type LeadStatus,
} from "@workspace/db";
import { logActivity } from "../system/activity.service";
import { emitDomainEvent } from "../automation/event-bus";
import { applyLeadScore } from "./scoring.service";
import { listTasksForLead } from "../crm/tasks.service";
import type { z } from "zod";
import type { createLeadSchema, updateLeadSchema, createLeadNoteSchema } from "./leads.schemas";

type CreateLeadInput = z.infer<typeof createLeadSchema>;
type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
type CreateNoteInput = z.infer<typeof createLeadNoteSchema>;

export async function createLead(
  input: CreateLeadInput,
  meta: { ip?: string; userAgent?: string },
): Promise<Lead> {
  const ipHash = meta.ip
    ? createHash("sha256").update(meta.ip).digest("hex").slice(0, 32)
    : null;

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      businessType: input.businessType,
      message: input.message,
      company: input.company ?? "",
      source: input.source ?? "contact_form",
      sourceDetail: input.sourceDetail ?? "",
      ipHash,
      userAgent: meta.userAgent ?? "",
    })
    .returning();

  await applyLeadScore(lead.id);
  const [scored] = await db.select().from(leadsTable).where(eq(leadsTable.id, lead.id)).limit(1);
  const finalLead = scored ?? lead;

  await emitDomainEvent(
    "lead.created",
    {
      entityType: "leads",
      entityId: finalLead.id,
      lead: finalLead,
      source: finalLead.source,
      email: finalLead.email,
    },
    {},
  );

  return finalLead;
}

export async function listLeads(query: {
  status?: LeadStatus;
  assignedTo?: "me" | "unassigned" | number;
  q?: string;
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
  actorUserId?: number | null;
  readAll?: boolean;
  sort?: "created_desc" | "score_desc";
}): Promise<Lead[]> {
  const conditions: SQL[] = [];

  if (query.status) {
    conditions.push(eq(leadsTable.status, query.status));
  }
  if (query.unreadOnly) {
    conditions.push(eq(leadsTable.isRead, false));
  }
  if (query.assignedTo === "unassigned") {
    conditions.push(sql`${leadsTable.assignedToId} IS NULL`);
  } else if (query.assignedTo === "me" && query.actorUserId != null) {
    conditions.push(eq(leadsTable.assignedToId, query.actorUserId));
  } else if (typeof query.assignedTo === "number") {
    conditions.push(eq(leadsTable.assignedToId, query.assignedTo));
  }

  if (!query.readAll && query.actorUserId != null) {
    conditions.push(
      or(
        eq(leadsTable.assignedToId, query.actorUserId),
        sql`${leadsTable.assignedToId} IS NULL`,
      )!,
    );
  }

  const q = query.q?.trim();
  if (q) {
    const pattern = `%${q}%`;
    conditions.push(
      or(
        ilike(leadsTable.name, pattern),
        ilike(leadsTable.email, pattern),
        ilike(leadsTable.phone, pattern),
        ilike(leadsTable.company, pattern),
      )!,
    );
  }

  const limit = Math.min(100, Math.max(1, query.limit ?? 50));
  const offset = Math.max(0, query.offset ?? 0);

  const base = db.select().from(leadsTable).$dynamic();
  if (conditions.length > 0) {
    base.where(and(...conditions));
  }
  const order =
    query.sort === "score_desc"
      ? [desc(leadsTable.score), desc(leadsTable.createdAt)]
      : [desc(leadsTable.createdAt)];

  return base.orderBy(...order).limit(limit).offset(offset);
}

export async function getLeadById(id: number): Promise<Lead | null> {
  const [row] = await db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);
  return row ?? null;
}

export async function getLeadDetail(id: number) {
  const lead = await getLeadById(id);
  if (!lead) return null;

  const notes = await db
    .select({
      id: leadNotesTable.id,
      body: leadNotesTable.body,
      createdAt: leadNotesTable.createdAt,
      authorUserId: leadNotesTable.authorUserId,
      authorDisplayName: usersTable.displayName,
    })
    .from(leadNotesTable)
    .leftJoin(usersTable, eq(leadNotesTable.authorUserId, usersTable.id))
    .where(eq(leadNotesTable.leadId, id))
    .orderBy(desc(leadNotesTable.createdAt));

  const timeline = await db
    .select()
    .from(activityEventsTable)
    .where(and(eq(activityEventsTable.entityType, "leads"), eq(activityEventsTable.entityId, id)))
    .orderBy(desc(activityEventsTable.createdAt))
    .limit(50);

  let assignee: { id: number; displayName: string } | null = null;
  if (lead.assignedToId != null) {
    const [u] = await db
      .select({ id: usersTable.id, displayName: usersTable.displayName })
      .from(usersTable)
      .where(eq(usersTable.id, lead.assignedToId))
      .limit(1);
    assignee = u ?? null;
  }

  const tasks = await listTasksForLead(id);

  return { lead, notes, timeline, assignee, tasks };
}

export async function updateLead(
  id: number,
  input: UpdateLeadInput,
  actorUserId: number | null,
): Promise<Lead | null> {
  const existing = await getLeadById(id);
  if (!existing) return null;

  const [updated] = await db
    .update(leadsTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(leadsTable.id, id))
    .returning();

  if (input.status && input.status !== existing.status) {
    await emitDomainEvent(
      "lead.status_changed",
      {
        entityType: "leads",
        entityId: id,
        lead: updated,
        metadata: { from: existing.status, to: input.status },
      },
      { actorUserId },
    );
  }
  if (input.assignedToId !== undefined && input.assignedToId !== existing.assignedToId) {
    await emitDomainEvent(
      "lead.assigned",
      {
        entityType: "leads",
        entityId: id,
        lead: updated,
        metadata: { assignedToId: input.assignedToId },
      },
      { actorUserId },
    );
  }

  await applyLeadScore(id);
  const [scored] = await db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);
  return scored ?? updated;
}

export async function markLeadRead(id: number, actorUserId: number | null): Promise<void> {
  const [row] = await db
    .update(leadsTable)
    .set({ isRead: true, updatedAt: new Date() })
    .where(and(eq(leadsTable.id, id), eq(leadsTable.isRead, false)))
    .returning();
  if (row) {
    await logActivity({
      actorUserId,
      action: "lead.read",
      entityType: "leads",
      entityId: id,
    });
  }
}

export async function addLeadNote(
  leadId: number,
  input: CreateNoteInput,
  actorUserId: number | null,
): Promise<{ id: number } | null> {
  const lead = await getLeadById(leadId);
  if (!lead) return null;

  const [note] = await db
    .insert(leadNotesTable)
    .values({
      leadId,
      body: input.body,
      authorUserId: actorUserId,
    })
    .returning({ id: leadNotesTable.id });

  await logActivity({
    actorUserId,
    action: "lead.note_added",
    entityType: "leads",
    entityId: leadId,
    metadata: { noteId: note.id },
  });

  return note;
}

export async function getLeadStats(): Promise<{
  byStatus: Record<LeadStatus, number>;
  unread: number;
  last7Days: number;
}> {
  const statusRows = await db
    .select({ status: leadsTable.status, total: count() })
    .from(leadsTable)
    .groupBy(leadsTable.status);

  const byStatus = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  } satisfies Record<LeadStatus, number>;
  for (const row of statusRows) {
    byStatus[row.status] = Number(row.total);
  }

  const [unreadRow] = await db
    .select({ total: count() })
    .from(leadsTable)
    .where(eq(leadsTable.isRead, false));

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [weekRow] = await db
    .select({ total: count() })
    .from(leadsTable)
    .where(gte(leadsTable.createdAt, weekAgo));

  return {
    byStatus,
    unread: Number(unreadRow?.total ?? 0),
    last7Days: Number(weekRow?.total ?? 0),
  };
}
