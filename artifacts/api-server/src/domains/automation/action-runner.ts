import { eq } from "drizzle-orm";
import { db, leadsTable, usersTable, type Lead } from "@workspace/db";
import { sendNewLeadEmail } from "../leads/lead-notify.service";
import { pickRoundRobinAssignee } from "../leads/assignment.service";
import { createTask } from "../crm/tasks.service";
import { sendViaConnection } from "../integrations/integrations.service";
import { deliverOutboundWebhook } from "../integrations/webhook.service";
import { logger } from "../../lib/logger";
import type { AutomationAction, AutomationActionConfig, DomainEventPayload } from "./types";

const BOOTSTRAP_EMAIL = "admin@precisefect.local";

function parseAction(raw: AutomationActionConfig): AutomationAction | null {
  switch (raw.type) {
    case "email":
      return { type: "email", template: raw.template ?? "new_lead" };
    case "update_field":
      if (!raw.field) return null;
      return { type: "update_field", field: raw.field, value: raw.value };
    case "assign_user":
      return {
        type: "assign_user",
        mode:
          raw.mode === "bootstrap"
            ? "bootstrap"
            : raw.mode === "round_robin"
              ? "round_robin"
              : undefined,
        userId: raw.userId,
      };
    case "create_task":
      if (!raw.title && typeof raw.value !== "string") return null;
      return {
        type: "create_task",
        title: String(raw.title ?? raw.value),
        dueInDays: typeof raw.dueInDays === "number" ? raw.dueInDays : undefined,
      };
    case "webhook":
      if (!raw.url && raw.connectionId == null) return null;
      return {
        type: "webhook",
        url: raw.url,
        connectionId: raw.connectionId,
      };
    default:
      return null;
  }
}

async function runEmailAction(template: string, payload: DomainEventPayload): Promise<void> {
  if (template !== "new_lead") {
    logger.warn({ template }, "Unknown email template");
    return;
  }
  const lead = payload.lead as Lead | undefined;
  if (!lead) {
    logger.warn("email action missing lead in payload");
    return;
  }
  await sendNewLeadEmail(lead);
}

async function runUpdateField(
  action: Extract<AutomationAction, { type: "update_field" }>,
  payload: DomainEventPayload,
): Promise<void> {
  const leadId = payload.entityId ?? (payload.lead as Lead | undefined)?.id;
  if (leadId == null || typeof leadId !== "number") return;

  const allowed = new Set(["priority", "status"]);
  if (!allowed.has(action.field)) {
    logger.warn({ field: action.field }, "update_field not allowed");
    return;
  }

  if (action.field === "status") {
    await db
      .update(leadsTable)
      .set({ status: action.value as Lead["status"], updatedAt: new Date() })
      .where(eq(leadsTable.id, leadId));
  } else if (action.field === "priority") {
    await db
      .update(leadsTable)
      .set({ priority: String(action.value), updatedAt: new Date() })
      .where(eq(leadsTable.id, leadId));
  }
}

async function runAssignUser(
  action: Extract<AutomationAction, { type: "assign_user" }>,
  payload: DomainEventPayload,
): Promise<void> {
  const leadId = payload.entityId ?? (payload.lead as Lead | undefined)?.id;
  if (leadId == null || typeof leadId !== "number") return;

  let userId = action.userId;
  if (userId == null && action.mode === "bootstrap") {
    const [user] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, BOOTSTRAP_EMAIL))
      .limit(1);
    userId = user?.id;
  }
  if (userId == null && action.mode === "round_robin") {
    userId = (await pickRoundRobinAssignee()) ?? undefined;
  }
  if (userId == null) return;

  await db
    .update(leadsTable)
    .set({ assignedToId: userId, updatedAt: new Date() })
    .where(eq(leadsTable.id, leadId));
}

async function runCreateTask(
  action: Extract<AutomationAction, { type: "create_task" }>,
  payload: DomainEventPayload,
): Promise<void> {
  const leadId = payload.entityId ?? (payload.lead as Lead | undefined)?.id;
  if (leadId == null || typeof leadId !== "number") return;

  let dueAt: string | undefined;
  if (action.dueInDays != null && action.dueInDays > 0) {
    const d = new Date();
    d.setDate(d.getDate() + action.dueInDays);
    dueAt = d.toISOString();
  }

  await createTask(
    leadId,
    { title: action.title, dueAt: dueAt ?? null, type: "follow_up" },
    null,
  );
}

async function runWebhook(
  action: Extract<AutomationAction, { type: "webhook" }>,
  payload: DomainEventPayload,
): Promise<void> {
  const eventName =
    typeof payload._event === "string"
      ? payload._event
      : String(payload.entityType ?? "event");

  if (action.connectionId != null) {
    const result = await sendViaConnection(action.connectionId, eventName, payload);
    if (!result.ok) throw new Error(result.error ?? "Webhook delivery failed");
    return;
  }

  if (!action.url) return;

  const result = await deliverOutboundWebhook({
    connectionId: 0,
    url: action.url,
    signingSecret: null,
    eventType: eventName,
    payload,
  });
  if (!result.ok) throw new Error(result.error ?? "Webhook delivery failed");
}

export async function executeActions(
  actions: AutomationActionConfig[],
  payload: DomainEventPayload,
): Promise<string | null> {
  for (const raw of actions) {
    const action = parseAction(raw);
    if (!action) continue;

    switch (action.type) {
      case "email":
        await runEmailAction(action.template, payload);
        break;
      case "update_field":
        await runUpdateField(action, payload);
        break;
      case "assign_user":
        await runAssignUser(action, payload);
        break;
      case "create_task":
        await runCreateTask(action, payload);
        break;
      case "webhook":
        await runWebhook(action, payload);
        break;
    }
  }
  return null;
}
