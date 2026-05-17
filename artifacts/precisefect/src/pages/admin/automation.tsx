import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsApi, type AutomationRule } from "@/lib/cms-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminAutomation() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("lead.status_changed");
  const [conditionTo, setConditionTo] = useState("");

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["automation", "rules"],
    queryFn: () => cmsApi.listAutomationRules(),
  });

  const { data: runs = [] } = useQuery({
    queryKey: ["automation", "runs"],
    queryFn: () => cmsApi.listAutomationRuns(20),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      cmsApi.createAutomationRule({
        name: name.trim(),
        triggerEvent,
        conditions: conditionTo ? { to: conditionTo } : {},
        actions: [{ type: "email", template: "new_lead" }],
        enabled: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation"] });
      setName("");
      setConditionTo("");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      cmsApi.updateAutomationRule(id, { enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["automation", "rules"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cmsApi.deleteAutomationRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["automation"] }),
  });

  return (
    <div className="px-8 lg:px-16 py-12">
      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">
        System
      </p>
      <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">Automation</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Event-driven rules run when leads are created or updated. The default new-lead rule sends
        email via Resend when configured.
      </p>

      <section className="mb-12 bg-surface-container-lowest border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-primary mb-4">Add rule</h2>
        <div className="grid gap-4 max-w-lg">
          <div>
            <Label htmlFor="rule-name">Name</Label>
            <Input
              id="rule-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Follow up when qualified"
            />
          </div>
          <div>
            <Label htmlFor="trigger">Trigger event</Label>
            <select
              id="trigger"
              className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={triggerEvent}
              onChange={(e) => setTriggerEvent(e.target.value)}
            >
              <option value="lead.created">lead.created</option>
              <option value="lead.status_changed">lead.status_changed</option>
              <option value="lead.assigned">lead.assigned</option>
            </select>
          </div>
          {triggerEvent === "lead.status_changed" && (
            <div>
              <Label htmlFor="cond-to">Only when status becomes (optional)</Label>
              <Input
                id="cond-to"
                value={conditionTo}
                onChange={(e) => setConditionTo(e.target.value)}
                placeholder="qualified"
              />
            </div>
          )}
          <Button
            type="button"
            disabled={!name.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Saving…" : "Create rule"}
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-primary mb-4">Rules</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rules.length === 0 ? (
          <p className="text-muted-foreground">
            No rules yet. Run seed-phase3 for the default new-lead email rule.
          </p>
        ) : (
          <ul className="space-y-3">
            {rules.map((rule: AutomationRule) => (
              <li
                key={rule.id}
                className="flex flex-wrap items-center gap-4 bg-surface-container-lowest border border-border rounded-lg px-4 py-3"
              >
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-primary">{rule.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rule.triggerEvent} · {rule.actions?.length ?? 0} action(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(enabled) =>
                      toggleMutation.mutate({ id: rule.id, enabled })
                    }
                  />
                  <span className="text-xs text-muted-foreground">
                    {rule.enabled ? "On" : "Off"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(rule.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-primary mb-4">Recent runs</h2>
        {runs.length === 0 ? (
          <p className="text-muted-foreground">Runs appear after events trigger rules.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {runs.map((run) => (
              <li
                key={run.id}
                className="flex flex-wrap gap-2 bg-surface-container-lowest border border-border rounded px-3 py-2"
              >
                <span className="font-mono text-xs">#{run.id}</span>
                <span
                  className={
                    run.status === "success"
                      ? "text-green-700"
                      : run.status === "failed"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {run.status}
                </span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {new Date(run.startedAt).toLocaleString()}
                </span>
                {run.error && (
                  <span className="w-full text-xs text-destructive">{run.error}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
