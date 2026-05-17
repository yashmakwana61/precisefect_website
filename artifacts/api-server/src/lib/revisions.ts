import { db, contentRevisionsTable } from "@workspace/db";

export async function recordRevision(
  entityType: string,
  entityId: number,
  snapshot: Record<string, unknown>,
  operation: "create" | "update" | "restore" = "update",
  createdById?: number | null,
): Promise<void> {
  const createdBy =
    createdById != null ? `user:${createdById}` : "admin";
  await db.insert(contentRevisionsTable).values({
    entityType,
    entityId,
    snapshot,
    operation,
    createdBy,
    createdById: createdById ?? null,
  });
}
