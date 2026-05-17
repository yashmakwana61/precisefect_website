import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsApi, type IntegrationConnection } from "@/lib/cms-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminIntegrations() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [label, setLabel] = useState("");
  const [provider, setProvider] = useState<"webhook" | "zapier" | "resend">("webhook");
  const [url, setUrl] = useState("");
  const [signingSecret, setSigningSecret] = useState("");

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["integrations", "connections"],
    queryFn: () => cmsApi.listIntegrationConnections(),
  });

  const { data: deliveries = [] } = useQuery({
    queryKey: ["integrations", "deliveries"],
    queryFn: () => cmsApi.listIntegrationDeliveries(40),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      cmsApi.createIntegrationConnection({
        label: label.trim(),
        provider,
        config: provider === "webhook" ? { url: url.trim() } : {},
        secrets:
          signingSecret.trim() && provider === "webhook"
            ? { signingSecret: signingSecret.trim() }
            : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      setLabel("");
      setUrl("");
      setSigningSecret("");
      toast({ title: "Connection created" });
    },
    onError: (e) => toast({ title: "Failed", description: String(e), variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: number; isEnabled: boolean }) =>
      cmsApi.updateIntegrationConnection(id, { isEnabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations", "connections"] }),
  });

  const testMutation = useMutation({
    mutationFn: (id: number) => cmsApi.testIntegrationConnection(id),
    onSuccess: (r) =>
      toast({
        title: r.ok ? "Test passed" : "Test failed",
        description: r.message,
        variant: r.ok ? "default" : "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cmsApi.deleteIntegrationConnection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations"] }),
  });

  return (
    <div className="px-8 lg:px-16 py-12 max-w-5xl">
      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">
        System
      </p>
      <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">Integrations</h1>
      <p className="text-muted-foreground mb-8">
        Connect outbound webhooks (Zapier/Make) or document Resend. Secrets are encrypted when{" "}
        <code className="text-xs">INTEGRATION_ENCRYPTION_KEY</code> is set on the API.
      </p>

      <section className="mb-12 bg-surface-container-lowest border border-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-primary mb-4">Add connection</h2>
        <div className="grid gap-4 max-w-lg">
          <div>
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Zapier leads" />
          </div>
          <div>
            <Label>Provider</Label>
            <select
              className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={provider}
              onChange={(e) => setProvider(e.target.value as typeof provider)}
            >
              <option value="webhook">Outbound webhook</option>
              <option value="zapier">Inbound (Zapier / Make)</option>
              <option value="resend">Resend (env reference)</option>
            </select>
          </div>
          {provider === "webhook" && (
            <>
              <div>
                <Label>Webhook URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/..."
                />
              </div>
              <div>
                <Label>Signing secret (optional)</Label>
                <Input
                  type="password"
                  value={signingSecret}
                  onChange={(e) => setSigningSecret(e.target.value)}
                  placeholder="HMAC secret for X-PSF-Signature"
                />
              </div>
            </>
          )}
          <Button
            type="button"
            disabled={!label.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            Create
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-primary mb-4">Connections</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : connections.length === 0 ? (
          <p className="text-muted-foreground">No connections yet.</p>
        ) : (
          <ul className="space-y-3">
            {connections.map((c: IntegrationConnection) => (
              <li
                key={c.id}
                className="border border-border rounded-lg p-4 bg-surface-container-lowest"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-primary">{c.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{c.provider}</p>
                    {c.webhookUrl && (
                      <p className="text-xs mt-2 break-all font-mono text-muted-foreground">
                        {c.webhookUrl}
                      </p>
                    )}
                    {c.hasSecrets && (
                      <p className="text-[10px] text-muted-foreground mt-1">Secrets stored</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={c.isEnabled}
                      onCheckedChange={(isEnabled) => toggleMutation.mutate({ id: c.id, isEnabled })}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => testMutation.mutate(c.id)}
                      disabled={testMutation.isPending}
                    >
                      Test
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(c.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-primary mb-4">Delivery log</h2>
        {deliveries.length === 0 ? (
          <p className="text-muted-foreground text-sm">No deliveries yet.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-left">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Dir</th>
                  <th className="px-3 py-2">Event</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">HTTP</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{d.direction}</td>
                    <td className="px-3 py-2">{d.eventType}</td>
                    <td
                      className={
                        d.status === "success"
                          ? "px-3 py-2 text-green-700"
                          : d.status === "failed"
                            ? "px-3 py-2 text-destructive"
                            : "px-3 py-2"
                      }
                    >
                      {d.status}
                    </td>
                    <td className="px-3 py-2">{d.httpStatus ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
