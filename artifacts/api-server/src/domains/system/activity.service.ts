import { db, activityEventsTable } from "@workspace/db";

export type ActivityInput = {
  actorUserId?: number | null;
  action: string;
  entityType?: string;
  entityId?: number;
  metadata?: Record<string, unknown>;
};

export async function logActivity(input: ActivityInput): Promise<void> {
  await db.insert(activityEventsTable).values({
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    metadata: input.metadata ?? {},
  });
}
