import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { cmsApi, type Lead, type LeadStatus } from "@/lib/cms-api";
import { LEAD_STATUS_LABELS } from "@/admin/leads-config";

const STATUSES: (LeadStatus | "")[] = ["", "new", "contacted", "qualified", "proposal", "won", "lost"];

function StatusBadge({ status }: { status: LeadStatus }) {
  const colors: Record<LeadStatus, string> = {
    new: "bg-primary text-white",
    contacted: "bg-surface-container-high text-primary",
    qualified: "bg-primary-container/20 text-primary",
    proposal: "bg-amber-100 text-amber-900",
    won: "bg-green-100 text-green-900",
    lost: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${colors[status]}`}>
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}

export default function LeadsList() {
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [q, setQ] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [sort, setSort] = useState<"created_desc" | "score_desc">("created_desc");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("status");
    if (s && STATUSES.includes(s as LeadStatus)) setStatus(s as LeadStatus);
    if (params.get("unread") === "1") setUnreadOnly(true);
    if (params.get("sort") === "score_desc") setSort("score_desc");
  }, []);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", status, q, unreadOnly, sort],
    queryFn: () =>
      cmsApi.listLeads({
        status: status || undefined,
        q: q || undefined,
        unreadOnly,
        sort,
        limit: 100,
      }),
  });

  return (
    <div className="px-8 lg:px-16 py-12">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">Leads</p>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Pipeline</h1>
        </div>
        <div className="flex flex-wrap gap-3 self-start">
          <Link
            href="/admin/leads/kanban"
            className="border border-border font-bold rounded-lg px-6 py-3 inline-flex items-center text-primary hover:bg-surface-container-low"
          >
            Board view
          </Link>
          <Link
            href="/admin/leads/new"
            className="signature-gradient text-white font-bold rounded-lg px-6 py-3 inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Add lead
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus | "")}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s || "all"} value={s}>
              {s ? LEAD_STATUS_LABELS[s] : "All statuses"}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search name, email, phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm flex-1 min-w-[200px] max-w-md"
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
          Unread only
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "created_desc" | "score_desc")}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm"
        >
          <option value="created_desc">Newest first</option>
          <option value="score_desc">Highest score</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="text-muted-foreground">No leads match your filters.</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low text-left">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Score</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold hidden md:table-cell">Source</th>
                <th className="px-4 py-3 font-bold hidden lg:table-cell">Industry</th>
                <th className="px-4 py-3 font-bold">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: Lead) => (
                <tr
                  key={lead.id}
                  className={`border-t border-border hover:bg-surface-container-low/50 ${!lead.isRead ? "font-semibold" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="text-primary hover:underline">
                      {lead.name}
                      {!lead.isRead && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-primary inline-block align-middle" />
                      )}
                    </Link>
                    <div className="text-xs text-muted-foreground font-normal">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{lead.score ?? 0}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell capitalize text-muted-foreground">
                    {lead.source.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{lead.businessType}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
