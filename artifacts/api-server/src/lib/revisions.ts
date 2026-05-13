import { db, contentRevisionsTable } from "@workspace/db";

export async function recordRevision(
  entityType: string,
  entityId: number,
  snapshot: Record<string, unknown>,
  operation: "create" | "update" | "restore" = "update",
): Promise<void> {
  await db.insert(contentRevisionsTable).values({
    entityType,
    entityId,
    snapshot,
    operation,
    createdBy: "admin",
  });
}
