import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FileText, Inbox } from "lucide-react";
import { cmsApi, type Lead } from "@/lib/cms-api";
import { collectionAdminPath, CONTENT_COLLECTIONS } from "@/admin/registry";
import { LEAD_STATUS_LABELS } from "@/admin/leads-config";
import { useAdmin } from "@/hooks/use-admin";

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="bg-surface-container-lowest ghost-border rounded-xl p-6">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>
  );
  return href ? <Link href={href} className="block hover:-translate-y-0.5 transition-transform">{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const { isAdmin } = useAdmin();

  const { data: stats } = useQuery({
    queryKey: ["dashboard", "lead-stats"],
    queryFn: () => cmsApi.getLeadStats(),
    enabled: isAdmin,
  });

  const { data: recentLeads = [] } = useQuery({
    queryKey: ["leads", "recent"],
    queryFn: () => cmsApi.listLeads({ limit: 5 }),
    enabled: isAdmin,
  });

  const { data: activity = [] } = useQuery({
    queryKey: ["system", "activity", 8],
    queryFn: () => cmsApi.listActivity(8),
    enabled: isAdmin,
  });

  const { data: taskDash } = useQuery({
    queryKey: ["tasks", "dashboard"],
    queryFn: () => cmsApi.getTaskDashboard(),
    enabled: isAdmin,
  });

  const newCount = stats?.byStatus?.new ?? 0;
  const unread = stats?.unread ?? 0;

  return (
    <div className="px-8 lg:px-16 py-12">
      <div className="mb-10">
        <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Operations</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Leads, content, and recent activity at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="New leads" value={newCount} href="/admin/leads?status=new" />
        <StatCard label="Unread" value={unread} href="/admin/leads?unread=1" />
        <StatCard label="Tasks due today" value={taskDash?.dueToday ?? 0} href="/admin/leads" />
        <StatCard label="Qualified" value={stats?.byStatus?.qualified ?? 0} href="/admin/leads?status=qualified" />
      </div>

      {(taskDash?.tasks?.length ?? 0) > 0 && (
        <section className="bg-surface-container-lowest border border-border rounded-xl p-6 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Due today</h2>
          <ul className="space-y-2 text-sm">
            {taskDash!.tasks.map((t) => (
              <li key={t.id}>
                <Link href={`/admin/leads/${t.leadId}`} className="text-primary font-medium hover:underline">
                  {t.title}
                </Link>
                <span className="text-muted-foreground"> — {t.leadName}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <section className="bg-surface-container-lowest border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Recent leads</h2>
            <Link href="/admin/leads" className="text-xs font-bold text-primary">View all</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentLeads.map((lead: Lead) => (
                <li key={lead.id}>
                  <Link href={`/admin/leads/${lead.id}`} className="flex justify-between gap-2 hover:text-primary">
                    <span className="font-medium">{lead.name}</span>
                    <span className="text-xs text-muted-foreground">{LEAD_STATUS_LABELS[lead.status]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="bg-surface-container-lowest border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Recent activity</h2>
            <Link href="/admin/system/activity" className="text-xs font-bold text-primary">Full log</Link>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {activity.map((ev) => (
                <li key={ev.id} className="flex justify-between gap-2">
                  <span className="truncate">{ev.action}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {new Date(ev.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="text-xs font-bold text-muted-foreground tracking-[0.18em] uppercase mb-4">Quick actions</p>
      <div className="flex flex-wrap gap-3 mb-12">
        <Link href="/admin/leads" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider">
          <Inbox className="w-4 h-4" /> All leads
        </Link>
        <Link href={collectionAdminPath("blog-posts")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-bold uppercase tracking-wider text-primary">
          <FileText className="w-4 h-4" /> New blog post
        </Link>
        <Link href="/admin/content/blog-posts" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-bold uppercase tracking-wider text-primary">
          Manage content
        </Link>
      </div>

      <p className="text-xs font-bold text-muted-foreground tracking-[0.18em] uppercase mb-6">Content collections</p>
      <div className="grid md:grid-cols-3 gap-4">
        {CONTENT_COLLECTIONS.slice(0, 3).map((c) => (
          <Link key={c.slug} href={collectionAdminPath(c.slug)} className="text-sm font-bold text-primary hover:underline">
            {c.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}
