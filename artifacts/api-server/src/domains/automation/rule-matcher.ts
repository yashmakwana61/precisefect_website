import type { AutomationRule } from "@workspace/db";
import type { DomainEventPayload } from "./types";

function matchesCondition(
  conditions: Record<string, unknown>,
  payload: DomainEventPayload,
): boolean {
  if (Object.keys(conditions).length === 0) return true;

  for (const [key, expected] of Object.entries(conditions)) {
    if (key === "status" && payload.lead && typeof payload.lead === "object") {
      const lead = payload.lead as { status?: string };
      if (lead.status !== expected) return false;
      continue;
    }
    if (key === "source" && payload.lead && typeof payload.lead === "object") {
      const lead = payload.lead as { source?: string };
      if (lead.source !== expected) return false;
      continue;
    }
    if (key === "to" && payload.metadata && typeof payload.metadata === "object") {
      const meta = payload.metadata as { to?: string };
      if (meta.to !== expected) return false;
      continue;
    }
    if (key === "from" && payload.metadata && typeof payload.metadata === "object") {
      const meta = payload.metadata as { from?: string };
      if (meta.from !== expected) return false;
      continue;
    }
    if (payload[key] !== expected) return false;
  }
  return true;
}

export function ruleMatchesEvent(
  rule: AutomationRule,
  eventName: string,
  payload: DomainEventPayload,
): boolean {
  if (!rule.enabled) return false;
  if (rule.triggerType !== "event") return false;
  if (rule.triggerEvent !== eventName) return false;
  return matchesCondition(rule.conditions ?? {}, payload);
}
