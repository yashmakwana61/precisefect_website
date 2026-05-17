import { useQuery } from "@tanstack/react-query";
import { cmsApi } from "@/lib/cms-api";

export default function AdminActivity() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["system", "activity"],
    queryFn: () => cmsApi.listActivity(50),
  });

  return (
    <div className="px-8 lg:px-16 py-12">
      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">System</p>
      <h1 className="text-3xl font-bold text-primary mb-8 tracking-tight">Activity Log</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground">No activity recorded yet. Actions appear after you create or edit content.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="bg-surface-container-lowest border border-border rounded-lg px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-primary uppercase text-xs tracking-wider">{e.action}</span>
                {e.entityType && (
                  <span className="text-muted-foreground">
                    {e.entityType}
                    {e.entityId != null ? ` #${e.entityId}` : ""}
                  </span>
                )}
                <span className="text-muted-foreground ml-auto text-xs">
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
