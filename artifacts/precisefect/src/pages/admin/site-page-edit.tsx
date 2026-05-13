import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { cmsApi, type SitePage } from "@/lib/cms-api";
import { getSitePageDefaults, normalizePagePath } from "@/lib/site-page-registry";
import { useToast } from "@/hooks/use-toast";
import { HtmlEditor } from "@/components/admin/html-editor";
import { RevisionsPanel } from "@/components/admin/revisions-panel";
import { withPreviewQuery } from "@/hooks/use-preview";

const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium text-sm";

function toDateTimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SitePageEdit() {
  const search = useSearch();
  const path = normalizePagePath(new URLSearchParams(search).get("path") ?? "");
  const defaults = getSitePageDefaults(path);
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState<Partial<SitePage>>({ path, title: defaults?.title ?? path });

  const { data: existing, isLoading } = useQuery({
    queryKey: ["site-page", "edit", path],
    queryFn: async () => {
      try {
        return await cmsApi.getSitePageContent(path, "preview");
      } catch {
        return null;
      }
    },
    enabled: Boolean(defaults),
  });

  useEffect(() => {
    if (!defaults) return;
    setForm({
      path,
      title: defaults.title,
      heroEyebrow: defaults.heroEyebrow,
      heroHeadline: defaults.heroHeadline,
      heroSubheadline: defaults.heroSubheadline,
      bodyContent: defaults.bodyContent,
      metaTitle: defaults.metaTitle,
      metaDescription: defaults.metaDescription,
      isPublished: true,
      publishedAt: new Date().toISOString(),
      ...(existing ?? {}),
    });
  }, [defaults, existing, path]);

  const set = (k: keyof SitePage, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: () => cmsApi.upsertSitePage(form as SitePage & { path: string; title: string }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-pages"] });
      qc.invalidateQueries({ queryKey: ["site-page", path] });
      toast({ title: "Page saved" });
    },
    onError: (e) => toast({ title: "Save failed", description: String(e), variant: "destructive" }),
  });

  const restore = useMutation({
    mutationFn: (snapshot: Partial<SitePage>) =>
      cmsApi.upsertSitePage({ ...form, ...snapshot, path, title: String(snapshot.title ?? form.title) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-page", "edit", path] });
      toast({ title: "Revision restored" });
    },
    onError: (e) => toast({ title: "Restore failed", description: String(e), variant: "destructive" }),
  });

  if (!defaults) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-16">
        <p className="text-muted-foreground">Unknown built-in page path.</p>
        <Link href="/admin/pages" className="text-primary font-bold underline">Back to pages</Link>
      </div>
    );
  }

  if (isLoading) return <div className="p-12 text-muted-foreground">Loading…</div>;

  const previewUrl = withPreviewQuery(path);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/admin/pages" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> All Pages
      </Link>

      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">Built-in page</p>
      <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">{defaults.title}</h1>
      <p className="text-sm text-muted-foreground mb-12 font-mono">{path}</p>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-8">
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-6 space-y-5">
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Hero</h2>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Eyebrow</label>
            <input type="text" value={form.heroEyebrow ?? ""} onChange={(e) => set("heroEyebrow", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Headline</label>
            <input type="text" value={form.heroHeadline ?? ""} onChange={(e) => set("heroHeadline", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Sub-headline</label>
            <textarea value={form.heroSubheadline ?? ""} onChange={(e) => set("heroSubheadline", e.target.value)} rows={3} className={`${inputBase} resize-none`} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3">Body Content (HTML)</label>
          <HtmlEditor value={form.bodyContent ?? ""} onChange={(v) => set("bodyContent", v)} />
          <p className="text-xs text-muted-foreground mt-2">Rendered below the hero section on the public page.</p>
        </div>

        <div className="bg-surface-container-lowest ghost-border rounded-xl p-6 space-y-5">
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">SEO</h2>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Meta Title</label>
            <input type="text" value={form.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Meta Description</label>
            <textarea value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} rows={2} className={`${inputBase} resize-none`} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3">Publish Date</label>
          <input
            type="datetime-local"
            value={toDateTimeLocal(form.publishedAt ?? "")}
            onChange={(e) => set("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : "")}
            className={inputBase}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isPublished !== false} onChange={(e) => set("isPublished", e.target.checked)} className="w-5 h-5 rounded" />
          <div>
            <div className="text-sm font-bold text-primary">Published</div>
            <div className="text-xs text-muted-foreground">When saved, CMS content overrides the built-in page defaults</div>
          </div>
        </label>

        {form.id && (
          <RevisionsPanel
            entityType="site-pages"
            entityId={form.id}
            onRestore={(snapshot) => {
              setForm((f) => ({ ...f, ...snapshot }));
              restore.mutate(snapshot as Partial<SitePage>);
            }}
          />
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
          <button type="submit" disabled={save.isPending} className="signature-gradient text-white font-bold rounded-lg px-8 py-4 btn-press inline-flex items-center disabled:opacity-50">
            <Save className="w-4 h-4 mr-2" />
            {save.isPending ? "Saving…" : "Save Page"}
          </button>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-primary gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </a>
          <Link href="/admin/pages" className="text-sm font-medium text-muted-foreground hover:text-primary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
