import type { AutomationActionConfig } from "@workspace/db";

export type DomainEventPayload = Record<string, unknown> & {
  entityType?: string;
  entityId?: number;
};

export type { AutomationActionConfig };

export type AutomationAction =
  | { type: "email"; template: string }
  | { type: "update_field"; field: string; value: unknown }
  | { type: "assign_user"; mode?: "bootstrap" | "round_robin"; userId?: number }
  | { type: "create_task"; title: string; dueInDays?: number }
  | { type: "webhook"; url?: string; connectionId?: number };
