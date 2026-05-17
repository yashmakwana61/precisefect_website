import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { cmsApi, type LeadStatus } from "@/lib/cms-api";
import { LEAD_STATUS_LABELS } from "@/admin/leads-config";
import { useToast } from "@/hooks/use-toast";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

export default function LeadDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const qc = useQueryClient();
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => cmsApi.getLead(id),
    enabled: Number.isFinite(id),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["system", "users"],
    queryFn: () => cmsApi.listUsers(),
  });

  const updateLead = useMutation({
    mutationFn: (patch: Parameters<typeof cmsApi.updateLead>[1]) => cmsApi.updateLead(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lead", id] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "lead-stats"] });
      toast({ title: "Lead updated" });
    },
    onError: (e) => toast({ title: "Update failed", description: String(e), variant: "destructive" }),
  });

  const addTask = useMutation({
    mutationFn: () =>
      cmsApi.createLeadTask(id, {
        title: taskTitle.trim(),
        dueAt: taskDue ? new Date(taskDue).toISOString() : null,
      }),
    onSuccess: () => {
      setTaskTitle("");
      setTaskDue("");
      qc.invalidateQueries({ queryKey: ["lead", id] });
      toast({ title: "Task created" });
    },
    onError: (e) => toast({ title: "Failed", description: String(e), variant: "destructive" }),
  });

  const completeTask = useMutation({
    mutationFn: (taskId: number) => cmsApi.updateTask(taskId, { status: "done" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lead", id] });
      toast({ title: "Task completed" });
    },
  });

  const addNote = useMutation({
    mutationFn: () => cmsApi.addLeadNote(id, note),
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["lead", id] });
      toast({ title: "Note added" });
    },
    onError: (e) => toast({ title: "Failed", description: String(e), variant: "destructive" }),
  });

  if (!Number.isFinite(id)) {
    return <p className="p-12 text-muted-foreground">Invalid lead id</p>;
  }

  if (isLoading || !data) {
    return <p className="p-12 text-muted-foreground">Loading…</p>;
  }

  const { lead, notes, timeline, assignee, tasks = [] } = data;

  return (
    <div className="px-8 lg:px-16 py-12 max-w-4xl">
      <Link href="/admin/leads" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> All leads
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-tight">{lead.name}</h1>
        <p className="text-muted-foreground mt-2">
          Received {new Date(lead.createdAt).toLocaleString()} · {lead.source.replace("_", " ")}
          {lead.score > 0 && (
            <span className="ml-2 text-primary font-bold">Score {lead.score}</span>
          )}
        </p>
      </div>

      <div className="grid gap-8">
        <section className="bg-surface-container-lowest border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Contact</h2>
          <p><span className="text-muted-foreground">Email:</span> <a href={`mailto:${lead.email}`} className="text-primary">{lead.email}</a></p>
          <p><span className="text-muted-foreground">Phone:</span> {lead.phone || "—"}</p>
          <p><span className="text-muted-foreground">Industry:</span> {lead.businessType}</p>
          <p className="whitespace-pre-wrap"><span className="text-muted-foreground block mb-1">Message</span>{lead.message}</p>
        </section>

        <section className="bg-surface-container-lowest border border-border rounded-xl p-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">Status</label>
            <select
              value={lead.status}
              onChange={(e) => updateLead.mutate({ status: e.target.value as LeadStatus })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">Assigned to</label>
            <select
              value={lead.assignedToId ?? ""}
              onChange={(e) =>
                updateLead.mutate({
                  assignedToId: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-border bg-surface"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.displayName}</option>
              ))}
            </select>
            {assignee && <p className="text-xs text-muted-foreground mt-1">Currently: {assignee.displayName}</p>}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-border rounded-xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Tasks</h2>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Follow up call…"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-sm"
            />
            <input
              type="datetime-local"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-surface text-sm"
            />
            <button
              type="button"
              disabled={!taskTitle.trim() || addTask.isPending}
              onClick={() => addTask.mutate()}
              className="signature-gradient text-white font-bold rounded-lg px-4 py-2 disabled:opacity-50"
            >
              Add task
            </button>
          </div>
          <ul className="space-y-2 mb-8">
            {tasks.length === 0 ? (
              <li className="text-sm text-muted-foreground">No tasks.</li>
            ) : (
              tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-2 text-sm border border-border rounded-lg px-3 py-2"
                >
                  <span className={t.status === "done" ? "line-through text-muted-foreground" : "font-medium"}>
                    {t.title}
                  </span>
                  {t.dueAt && (
                    <span className="text-xs text-muted-foreground">
                      Due {new Date(t.dueAt).toLocaleString()}
                    </span>
                  )}
                  {t.status === "open" && (
                    <button
                      type="button"
                      className="ml-auto text-xs font-bold text-primary"
                      onClick={() => completeTask.mutate(t.id)}
                    >
                      Done
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="bg-surface-container-lowest border border-border rounded-xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Notes</h2>
          <div className="flex gap-2 mb-6">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Add an internal note…"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface resize-none"
            />
            <button
              type="button"
              disabled={!note.trim() || addNote.isPending}
              onClick={() => addNote.mutate()}
              className="signature-gradient text-white font-bold rounded-lg px-4 py-2 self-end disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <ul className="space-y-3">
            {notes.length === 0 ? (
              <li className="text-sm text-muted-foreground">No notes yet.</li>
            ) : (
              notes.map((n) => (
                <li key={n.id} className="text-sm border-l-2 border-primary pl-3">
                  <p>{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {n.authorDisplayName ?? "System"} · {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="bg-surface-container-lowest border border-border rounded-xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Activity</h2>
          <ul className="space-y-2 text-sm">
            {timeline.length === 0 ? (
              <li className="text-muted-foreground">No activity.</li>
            ) : (
              timeline.map((ev) => (
                <li key={ev.id} className="flex justify-between gap-4 border-b border-border/50 pb-2">
                  <span className="font-medium">{ev.action}</span>
                  <span className="text-muted-foreground shrink-0">{new Date(ev.createdAt).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
