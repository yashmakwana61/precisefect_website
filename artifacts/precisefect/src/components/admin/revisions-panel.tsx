import { useQuery } from "@tanstack/react-query";
import { History, RotateCcw } from "lucide-react";
import { cmsApi, type ContentRevision } from "@/lib/cms-api";

interface RevisionsPanelProps {
  entityType: string;
  entityId: number | null;
  onRestore: (snapshot: Record<string, unknown>) => void;
}

export function RevisionsPanel({ entityType, entityId, onRestore }: RevisionsPanelProps) {
  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ["revisions", entityType, entityId],
    queryFn: () => cmsApi.listRevisions(entityType, entityId!),
    enabled: !!entityId,
  });

  if (!entityId) return null;

  return (
    <div className="bg-surface-container-lowest ghost-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">Revision History</h3>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading revisions…</p>
      ) : revisions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No revisions yet. Save to create the first snapshot.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {revisions.map((rev: ContentRevision) => (
            <li key={rev.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface border border-border">
              <div>
                <p className="text-xs font-bold text-primary capitalize">{rev.operation}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(rev.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRestore(rev.snapshot as Record<string, unknown>)}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container"
              >
                <RotateCcw className="w-3 h-3" /> Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
