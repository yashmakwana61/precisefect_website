import { and, eq } from "drizzle-orm";
import { db, automationRulesTable, moduleRegistryTable } from "@workspace/db";
import { logActivity } from "../system/activity.service";
import { ruleMatchesEvent } from "./rule-matcher";
import { executeActions } from "./action-runner";
import { createAutomationRun, finishAutomationRun } from "./automation.service";
import type { DomainEventPayload } from "./types";
import { logger } from "../../lib/logger";

export async function emitDomainEvent(
  eventName: string,
  payload: DomainEventPayload,
  ctx?: { actorUserId?: number | null },
): Promise<void> {
  await logActivity({
    actorUserId: ctx?.actorUserId ?? null,
    action: eventName,
    entityType: (payload.entityType as string) ?? null,
    entityId: typeof payload.entityId === "number" ? payload.entityId : undefined,
    metadata: payload,
  });

  setImmediate(() => {
    void processAutomationForEvent(eventName, payload).catch((err) => {
      logger.error({ err, eventName }, "automation processing failed");
    });
  });
}

async function isAutomationEnabled(): Promise<boolean> {
  try {
    const [row] = await db
      .select({ isEnabled: moduleRegistryTable.isEnabled })
      .from(moduleRegistryTable)
      .where(eq(moduleRegistryTable.key, "automation"))
      .limit(1);
    return row?.isEnabled !== false;
  } catch {
    return true;
  }
}

export async function processAutomationForEvent(
  eventName: string,
  payload: DomainEventPayload,
): Promise<void> {
  if (!(await isAutomationEnabled())) return;

  const rules = await db
    .select()
    .from(automationRulesTable)
    .where(
      and(
        eq(automationRulesTable.enabled, true),
        eq(automationRulesTable.triggerType, "event"),
        eq(automationRulesTable.triggerEvent, eventName),
      ),
    );

  for (const rule of rules) {
    if (!ruleMatchesEvent(rule, eventName, payload)) continue;

    const runId = await createAutomationRun(rule.id, payload);
    try {
      const err = await executeActions(rule.actions ?? [], {
        ...payload,
        _event: eventName,
      });
      await finishAutomationRun(runId, err ? "failed" : "success", err);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await finishAutomationRun(runId, "failed", message);
    }
  }
}
