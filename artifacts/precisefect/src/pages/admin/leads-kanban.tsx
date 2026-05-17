import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { cmsApi, type Lead, type LeadStatus } from "@/lib/cms-api";
import { LEAD_STATUS_LABELS } from "@/admin/leads-config";

const PIPELINE: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export default function LeadsKanban() {
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", "kanban"],
    queryFn: () => cmsApi.listLeads({ limit: 200, sort: "score_desc" }),
  });

  const updateLead = useMutation({
    mutationFn: ({ id, status }: { id: number; status: LeadStatus }) =>
      cmsApi.updateLead(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const byStatus = PIPELINE.reduce(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status);
      return acc;
    },
    {} as Record<LeadStatus, Lead[]>,
  );

  return (
    <div className="px-8 lg:px-16 py-12">
      <Link
        href="/admin/leads"
        className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Table view
      </Link>

      <div className="mb-8">
        <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">
          Leads
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-primary">Pipeline board</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Change status from the column dropdown on each card.
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE.map((status) => (
            <div
              key={status}
              className="min-w-[240px] w-64 shrink-0 bg-surface-container-low rounded-xl border border-border p-3"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                  {LEAD_STATUS_LABELS[status]}
                </h2>
                <span className="text-xs text-muted-foreground">{byStatus[status].length}</span>
              </div>
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                {byStatus[status].map((lead) => (
                  <li
                    key={lead.id}
                    className="bg-surface-container-lowest border border-border rounded-lg p-3 text-sm"
                  >
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-bold text-primary hover:underline block truncate"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.email}</p>
                    {lead.score > 0 && (
                      <p className="text-[10px] font-bold text-primary mt-1">Score {lead.score}</p>
                    )}
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateLead.mutate({
                          id: lead.id,
                          status: e.target.value as LeadStatus,
                        })
                      }
                      className="mt-2 w-full text-xs rounded border border-border bg-surface px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {PIPELINE.map((s) => (
                        <option key={s} value={s}>
                          {LEAD_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
                {byStatus[status].length === 0 && (
                  <li className="text-xs text-muted-foreground px-1 py-4 text-center">Empty</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
