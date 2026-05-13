import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { cmsApi, type CollectionName, type CaseStudyMetric } from "@/lib/cms-api";
import { collectionConfigs, type FieldDef } from "./collection-config";
import { useToast } from "@/hooks/use-toast";
import { HtmlEditor } from "@/components/admin/html-editor";
import { RevisionsPanel } from "@/components/admin/revisions-panel";
import { AssetPicker } from "@/components/admin/asset-picker";
import { withPreviewQuery } from "@/hooks/use-preview";

const METRIC_ICONS: CaseStudyMetric["icon"][] = ["TrendingUp", "Clock", "BarChart", "Zap", "Shield", "Users"];

function toDateTimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium";

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          data-testid={`input-${field.key}`}
          className={inputBase}
        />
      );
    case "textarea":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
          data-testid={`input-${field.key}`}
          className={`${inputBase} resize-y min-h-[120px]`}
        />
      );
    case "longtext":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={10}
          data-testid={`input-${field.key}`}
          className={`${inputBase} resize-y min-h-[280px] font-mono text-sm`}
        />
      );
    case "html":
      return (
        <HtmlEditor
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          testId={`input-${field.key}`}
        />
      );
    case "image":
      return <ImageUrlField value={(value as string) ?? ""} onChange={onChange} testId={`input-${field.key}`} />;
    case "number":
      return (
        <input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          required={field.required}
          data-testid={`input-${field.key}`}
          className={inputBase}
        />
      );
    case "boolean":
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            data-testid={`input-${field.key}`}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary-container"
          />
          <span className="text-sm font-medium text-foreground">
            {value ? "Visible to public" : "Hidden draft"}
          </span>
        </label>
      );
    case "datetime":
      return (
        <input
          type="datetime-local"
          value={toDateTimeLocal((value as string) ?? "")}
          onChange={(e) => onChange(new Date(e.target.value).toISOString())}
          required={field.required}
          data-testid={`input-${field.key}`}
          className={inputBase}
        />
      );
    case "select":
      return (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`input-${field.key}`}
          className={inputBase}
        >
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case "metrics": {
      const metrics = (value as CaseStudyMetric[]) ?? [];
      const update = (i: number, patch: Partial<CaseStudyMetric>) => {
        const next = [...metrics];
        next[i] = { ...next[i], ...patch };
        onChange(next);
      };
      const remove = (i: number) => onChange(metrics.filter((_, idx) => idx !== i));
      const add = () => onChange([...metrics, { label: "", value: "", icon: "TrendingUp" }]);
      return (
        <div className="space-y-3">
          {metrics.map((m, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-surface ghost-border rounded-lg p-3">
              <input
                type="text"
                placeholder="Label"
                value={m.label}
                onChange={(e) => update(i, { label: e.target.value })}
                data-testid={`input-metric-label-${i}`}
                className="col-span-5 px-3 py-2 rounded bg-surface-container-lowest border border-border text-sm"
              />
              <input
                type="text"
                placeholder="Value"
                value={m.value}
                onChange={(e) => update(i, { value: e.target.value })}
                data-testid={`input-metric-value-${i}`}
                className="col-span-3 px-3 py-2 rounded bg-surface-container-lowest border border-border text-sm"
              />
              <select
                value={m.icon}
                onChange={(e) => update(i, { icon: e.target.value as CaseStudyMetric["icon"] })}
                data-testid={`input-metric-icon-${i}`}
                className="col-span-3 px-3 py-2 rounded bg-surface-container-lowest border border-border text-sm"
              >
                {METRIC_ICONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(i)}
                data-testid={`button-remove-metric-${i}`}
                className="col-span-1 p-2 text-muted-foreground hover:text-destructive"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            data-testid="button-add-metric"
            className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-container"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Metric
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}

function ImageUrlField({ value, onChange, testId }: { value: string; onChange: (v: string) => void; testId?: string }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium";
  return (
    <div className="space-y-3">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId} className={inputBase} placeholder="https://..." />
      <button type="button" onClick={() => setPickerOpen(true)} className="text-xs font-bold text-primary hover:text-primary-container">Choose from library</button>
      {value && <img src={value} alt="" className="max-h-32 rounded-lg border border-border" />}
      <AssetPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChange} />
    </div>
  );
}

function previewPath(collection: CollectionName, form: Record<string, unknown>): string | null {
  const slug = String(form.slug ?? "");
  if (collection === "blog-posts" && slug) return withPreviewQuery(`/blog/${slug}`);
  if (collection === "case-studies") return withPreviewQuery("/case-studies");
  if (collection === "faqs") return withPreviewQuery("/faq");
  if (collection === "job-openings") return withPreviewQuery("/careers");
  return null;
}

export default function CollectionEdit() {
  const params = useParams<{ collection: string; id?: string }>();
  const collection = params.collection as CollectionName;
  const config = collectionConfigs[collection];
  const isNew = !params.id || params.id === "new";
  const id = isNew ? null : Number(params.id);
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState<Record<string, unknown>>({});

  const { data: existing, isLoading } = useQuery({
    queryKey: ["collection", collection, id],
    queryFn: () => cmsApi.get<Record<string, unknown>>(collection, id!),
    enabled: !isNew && !!id,
  });

  useEffect(() => {
    if (isNew) {
      setForm({ ...config.defaults });
    } else if (existing) {
      setForm({ ...existing });
    }
  }, [isNew, existing, config]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      for (const f of config.fields) payload[f.key] = form[f.key];
      if (isNew) {
        return cmsApi.create(collection, payload);
      }
      return cmsApi.update(collection, id!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collection", collection] });
      qc.invalidateQueries({ queryKey: ["public", collection] });
      toast({ title: isNew ? "Created" : "Saved" });
      setLocation(`/admin/${collection}`);
    },
    onError: (e) => toast({ title: "Save failed", description: String(e), variant: "destructive" }),
  });

  const restore = useMutation({
    mutationFn: async (snapshot: Record<string, unknown>) => {
      const payload: Record<string, unknown> = {};
      for (const f of config.fields) payload[f.key] = snapshot[f.key];
      if (isNew || !id) return;
      return cmsApi.update(collection, id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collection", collection] });
      qc.invalidateQueries({ queryKey: ["revisions", collection, id] });
      toast({ title: "Revision restored" });
    },
    onError: (e) => toast({ title: "Restore failed", description: String(e), variant: "destructive" }),
  });

  if (!config) return <div className="p-12">Unknown collection</div>;
  if (!isNew && isLoading) return <div className="p-12 text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link
        href={`/admin/${collection}`}
        data-testid="link-back-to-list"
        className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> {config.name}
      </Link>

      <h1 className="text-4xl font-bold tracking-tight text-primary mb-3">
        {isNew ? `New ${config.singularName}` : `Edit ${config.singularName}`}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="mt-12 space-y-8"
      >
        {config.fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3"
            >
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </label>
            <FieldInput
              field={field}
              value={form[field.key]}
              onChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
            />
            {field.helpText && (
              <p className="mt-2 text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        ))}

        {!isNew && id && (
          <RevisionsPanel
            entityType={collection}
            entityId={id}
            onRestore={(snapshot) => {
              setForm((f) => ({ ...f, ...snapshot }));
              restore.mutate(snapshot);
            }}
          />
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
          <button
            type="submit"
            disabled={save.isPending}
            data-testid="button-save"
            className="signature-gradient text-white font-bold rounded-lg px-8 py-4 btn-press inline-flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {save.isPending ? "Saving…" : isNew ? "Create" : "Save Changes"}
          </button>
          {previewPath(collection, form) && (
            <a href={previewPath(collection, form)!} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-primary gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </a>
          )}
          <Link
            href={`/admin/${collection}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
