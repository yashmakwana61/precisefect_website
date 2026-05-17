import { desc, eq } from "drizzle-orm";
import { db, integrationDeliveryLogTable } from "@workspace/db";

export async function logDelivery(input: {
  connectionId?: number | null;
  direction: "inbound" | "outbound";
  eventType: string;
  payload: Record<string, unknown>;
  status: "success" | "failed" | "pending";
  httpStatus?: number | null;
  error?: string | null;
  attempts?: number;
}) {
  const [row] = await db
    .insert(integrationDeliveryLogTable)
    .values({
      connectionId: input.connectionId ?? null,
      direction: input.direction,
      eventType: input.eventType,
      payload: input.payload,
      status: input.status,
      httpStatus: input.httpStatus ?? null,
      error: input.error ?? null,
      attempts: input.attempts ?? 1,
    })
    .returning();
  return row;
}

export async function listDeliveries(limit = 50, connectionId?: number) {
  const base = db
    .select()
    .from(integrationDeliveryLogTable)
    .orderBy(desc(integrationDeliveryLogTable.createdAt))
    .limit(limit)
    .$dynamic();

  if (connectionId != null) {
    return base.where(eq(integrationDeliveryLogTable.connectionId, connectionId));
  }
  return base;
}
