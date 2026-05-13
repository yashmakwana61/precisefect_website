import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from "lucide-react";
import { cmsApi, type CustomPage } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";
import { HtmlEditor } from "@/components/admin/html-editor";
import { RevisionsPanel } from "@/components/admin/revisions-panel";
import { withPreviewQuery } from "@/hooks/use-preview";

function toDateTimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const PAGE_TYPES = [
  { value: "landing", label: "Landing Page", description: "Hero + feature highlights + CTA. Best for service or product pages." },
  { value: "content", label: "Content Page", description: "Hero + rich text body. Best for articles, policies, or deep-dives." },
  { value: "list", label: "Feature List Page", description: "Hero + structured list of items with title and description." },
];

const DEFAULT_BLOCKS = {
  landing: { heroHeadline: "Headline Goes Here.", heroSubheadline: "Supporting statement that clarifies the value proposition.", heroCtaText: "Get Started", heroCtaUrl: "/contact", bodyContent: "", listItems: [] },
  content: { heroHeadline: "Page Title.", heroSubheadline: "Brief introduction to this page.", heroCtaText: "", heroCtaUrl: "", bodyContent: "Start writing your content here...", listItems: [] },
  list: { heroHeadline: "Feature Breakdown.", heroSubheadline: "A structured overview of what we offer.", heroCtaText: "Contact Us", heroCtaUrl: "/contact", bodyContent: "", listItems: [{ title: "Feature One", description: "Describe this feature in one sentence." }] },
};

type ListItem = { title: string; description: string };

const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium text-sm";

export default function PageEdit() {
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";
  const id = isNew ? null : Number(params.id);
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState<Partial<CustomPage>>({
    title: "", slug: "", pageType: "landing", isPublished: false, sortOrder: 0,
    metaTitle: "", metaDescription: "", publishedAt: new Date().toISOString(),
    ...DEFAULT_BLOCKS.landing,
  });

  const { data: existing } = useQuery({
    queryKey: ["custom-page", id],
    queryFn: () => cmsApi.getCustomPage(id!),
    enabled: !isNew && !!id,
  });

  useEffect(() => {
    if (existing) setForm({ ...existing });
  }, [existing]);

  const set = (k: keyof CustomPage, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  function onTypeChange(t: string) {
    const defaults = DEFAULT_BLOCKS[t as keyof typeof DEFAULT_BLOCKS] ?? DEFAULT_BLOCKS.landing;
    setForm(f => ({ ...f, pageType: t, ...defaults }));
  }

  const listItems = (form.listItems ?? []) as ListItem[];
  const addItem = () => set("listItems", [...listItems, { title: "", description: "" }]);
  const updateItem = (i: number, patch: Partial<ListItem>) => {
    const next = [...listItems]; next[i] = { ...next[i], ...patch }; set("listItems", next);
  };
  const removeItem = (i: number) => set("listItems", listItems.filter((_, idx) => idx !== i));

  const restore = useMutation({
    mutationFn: (snapshot: Partial<CustomPage>) => cmsApi.updateCustomPage(id!, snapshot),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["custom-page", id] });
      qc.invalidateQueries({ queryKey: ["revisions", "custom-pages", id] });
      toast({ title: "Revision restored" });
    },
    onError: (e) => toast({ title: "Restore failed", description: String(e), variant: "destructive" }),
  });

  const previewUrl = form.slug ? withPreviewQuery(`/p/${form.slug}`) : null;

  const save = useMutation({
    mutationFn: () => isNew ? cmsApi.createCustomPage(form) : cmsApi.updateCustomPage(id!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["custom-pages"] });
      toast({ title: isNew ? "Page created" : "Page saved" });
      setLocation("/admin/pages");
    },
    onError: (e) => toast({ title: "Save failed", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/admin/pages" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Pages
      </Link>

      <h1 className="text-4xl font-bold tracking-tight text-primary mb-12">
        {isNew ? "New Page" : "Edit Page"}
      </h1>

      <form onSubmit={e => { e.preventDefault(); save.mutate(); }} className="space-y-8">

        {/* Page Type — only shown when creating */}
        {isNew && (
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-4">Design Template <span className="text-destructive">*</span></label>
            <div className="grid sm:grid-cols-3 gap-4">
              {PAGE_TYPES.map(pt => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => onTypeChange(pt.value)}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${form.pageType === pt.value ? "border-primary bg-primary/5" : "border-border bg-surface-container-lowest hover:border-primary/40"}`}
                >
                  <div className={`text-sm font-bold mb-2 ${form.pageType === pt.value ? "text-primary" : "text-foreground"}`}>{pt.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{pt.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic info */}
        <div>
          <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3">Page Title <span className="text-destructive">*</span></label>
          <input type="text" required value={form.title ?? ""} onChange={e => set("title", e.target.value)} className={inputBase} placeholder="About Our Process" />
        </div>

        <div>
          <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3">URL Slug <span className="text-destructive">*</span></label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium shrink-0">/p/</span>
            <input type="text" required value={form.slug ?? ""} onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} className={inputBase} placeholder="about-our-process" />
          </div>
        </div>

        {/* Hero */}
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-6 space-y-5">
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Hero Section</h2>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Headline</label>
            <input type="text" value={form.heroHeadline ?? ""} onChange={e => set("heroHeadline", e.target.value)} className={inputBase} placeholder="Your Powerful Headline." />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Sub-headline</label>
            <textarea value={form.heroSubheadline ?? ""} onChange={e => set("heroSubheadline", e.target.value)} rows={2} className={`${inputBase} resize-none`} placeholder="Supporting description..." />
          </div>
          {(form.pageType === "landing" || form.pageType === "list") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">CTA Button Text</label>
                <input type="text" value={form.heroCtaText ?? ""} onChange={e => set("heroCtaText", e.target.value)} className={inputBase} placeholder="Get Started" />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">CTA URL</label>
                <input type="text" value={form.heroCtaUrl ?? ""} onChange={e => set("heroCtaUrl", e.target.value)} className={inputBase} placeholder="/contact" />
              </div>
            </div>
          )}
        </div>

        {/* Content section based on type */}
        {(form.pageType === "content" || form.pageType === "landing") && (
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-3">Body Content</label>
            <HtmlEditor value={form.bodyContent ?? ""} onChange={(v) => set("bodyContent", v)} />
          </div>
        )}

        {form.pageType === "list" && (
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.15em] uppercase mb-4">Feature Items</label>
            <div className="space-y-3">
              {listItems.map((item, i) => (
                <div key={i} className="bg-surface ghost-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item {i + 1}</span>
                    <button type="button" onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input type="text" value={item.title} onChange={e => updateItem(i, { title: e.target.value })} className={inputBase} placeholder="Feature title" />
                  <textarea value={item.description} onChange={e => updateItem(i, { description: e.target.value })} rows={2} className={`${inputBase} resize-none`} placeholder="Brief description..." />
                </div>
              ))}
              <button type="button" onClick={addItem} className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-container">
                <Plus className="w-4 h-4 mr-1.5" /> Add Item
              </button>
            </div>
          </div>
        )}

        {/* SEO */}
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-6 space-y-5">
          <h2 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">SEO</h2>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Meta Title</label>
            <input type="text" value={form.metaTitle ?? ""} onChange={e => set("metaTitle", e.target.value)} className={inputBase} placeholder="Falls back to page title" />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Meta Description</label>
            <textarea value={form.metaDescription ?? ""} onChange={e => set("metaDescription", e.target.value)} rows={2} className={`${inputBase} resize-none`} placeholder="Brief page description for search engines..." />
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

        {/* Visibility */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={Boolean(form.isPublished)} onChange={e => set("isPublished", e.target.checked)} className="w-5 h-5 rounded" />
          <div>
            <div className="text-sm font-bold text-primary">Published</div>
            <div className="text-xs text-muted-foreground">Make this page visible at /p/{form.slug || "slug"}</div>
          </div>
        </label>

        {!isNew && id && (
          <RevisionsPanel
            entityType="custom-pages"
            entityId={id}
            onRestore={(snapshot) => {
              setForm((f) => ({ ...f, ...snapshot }));
              restore.mutate(snapshot as Partial<CustomPage>);
            }}
          />
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-border flex-wrap">
          <button type="submit" disabled={save.isPending} className="signature-gradient text-white font-bold rounded-lg px-8 py-4 btn-press inline-flex items-center disabled:opacity-50">
            <Save className="w-4 h-4 mr-2" />
            {save.isPending ? "Saving…" : isNew ? "Create Page" : "Save Changes"}
          </button>
          {previewUrl && (
            <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-primary gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </a>
          )}
          <Link href="/admin/pages" className="text-sm font-medium text-muted-foreground hover:text-primary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
