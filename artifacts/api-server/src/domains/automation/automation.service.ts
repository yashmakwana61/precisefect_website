import { desc, eq } from "drizzle-orm";
import { db, automationRulesTable, automationRunsTable } from "@workspace/db";
import type { DomainEventPayload } from "./types";

export async function createAutomationRun(
  ruleId: number,
  payload: DomainEventPayload,
): Promise<number> {
  const [row] = await db
    .insert(automationRunsTable)
    .values({
      ruleId,
      status: "running",
      triggerPayload: payload,
    })
    .returning({ id: automationRunsTable.id });
  return row.id;
}

export async function finishAutomationRun(
  runId: number,
  status: "success" | "failed",
  error?: string | null,
): Promise<void> {
  await db
    .update(automationRunsTable)
    .set({
      status,
      error: error ?? null,
      finishedAt: new Date(),
    })
    .where(eq(automationRunsTable.id, runId));
}

export async function listRules() {
  return db.select().from(automationRulesTable).orderBy(desc(automationRulesTable.id));
}

export async function getRule(id: number) {
  const [row] = await db
    .select()
    .from(automationRulesTable)
    .where(eq(automationRulesTable.id, id))
    .limit(1);
  return row ?? null;
}

export async function createRule(input: {
  name: string;
  enabled?: boolean;
  triggerType?: string;
  triggerEvent: string;
  triggerSchedule?: string | null;
  conditions?: Record<string, unknown>;
  actions?: Array<Record<string, unknown>>;
  moduleKey?: string;
}) {
  const [row] = await db
    .insert(automationRulesTable)
    .values({
      name: input.name,
      enabled: input.enabled ?? true,
      triggerType: input.triggerType ?? "event",
      triggerEvent: input.triggerEvent,
      triggerSchedule: input.triggerSchedule ?? null,
      conditions: input.conditions ?? {},
      actions: (input.actions ?? []) as typeof automationRulesTable.$inferInsert.actions,
      moduleKey: input.moduleKey ?? "leads",
      updatedAt: new Date(),
    })
    .returning();
  return row;
}

export async function updateRule(
  id: number,
  input: Partial<{
    name: string;
    enabled: boolean;
    triggerEvent: string;
    conditions: Record<string, unknown>;
    actions: Array<Record<string, unknown>>;
  }>,
) {
  const [row] = await db
    .update(automationRulesTable)
    .set({ ...input, updatedAt: new Date() } as Partial<typeof automationRulesTable.$inferInsert>)
    .where(eq(automationRulesTable.id, id))
    .returning();
  return row ?? null;
}

export async function deleteRule(id: number): Promise<boolean> {
  const deleted = await db
    .delete(automationRulesTable)
    .where(eq(automationRulesTable.id, id))
    .returning({ id: automationRulesTable.id });
  return deleted.length > 0;
}

export async function listRuns(limit = 30) {
  return db
    .select()
    .from(automationRunsTable)
    .orderBy(desc(automationRunsTable.startedAt))
    .limit(limit);
}
