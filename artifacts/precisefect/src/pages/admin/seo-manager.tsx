import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { cmsApi, type SeoPage } from "@/lib/cms-api";
import { SITE_PAGE_REGISTRY } from "@/lib/site-page-registry";
import { useToast } from "@/hooks/use-toast";

const PAGE_SLUGS = SITE_PAGE_REGISTRY.map((p) => ({ slug: p.path, label: p.title }));

const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium text-sm";

export default function SeoManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeSlug, setActiveSlug] = useState("/");
  const [form, setForm] = useState<Partial<SeoPage>>({});
  const [loaded, setLoaded] = useState<string | null>(null);

  const { data: allSeo = [] } = useQuery({
    queryKey: ["seo", "all"],
    queryFn: () => cmsApi.getAllSeo(),
  });

  // Load current slug data into form when tab changes
  function selectSlug(slug: string) {
    setActiveSlug(slug);
    const existing = allSeo.find(s => s.slug === slug);
    setForm({ slug, metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", ogImageUrl: "", canonicalUrl: "", noIndex: false, ...existing });
    setLoaded(slug);
  }

  if (loaded === null && allSeo.length >= 0) {
    const existing = allSeo.find(s => s.slug === "/");
    setForm({ slug: "/", metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", ogImageUrl: "", canonicalUrl: "", noIndex: false, ...existing });
    setLoaded("/");
  }

  const save = useMutation({
    mutationFn: () => cmsApi.upsertSeo({ ...form, slug: activeSlug }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seo"] });
      toast({ title: "SEO saved" });
    },
    onError: (e) => toast({ title: "Save failed", description: String(e), variant: "destructive" }),
  });

  const set = (k: keyof SeoPage, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const charCount = (val: string, max: number) => (
    <span className={`text-xs ${val.length > max ? "text-destructive" : "text-muted-foreground"}`}>
      {val.length}/{max}
    </span>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-16">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Console
      </Link>

      <div className="mb-12">
        <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">Search Engine</p>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-3">SEO Management</h1>
        <p className="text-muted-foreground">Override meta tags, Open Graph data, and indexing rules per page.</p>
      </div>

      <div className="flex gap-8">
        {/* Page selector */}
        <div className="w-52 shrink-0">
          <div className="bg-surface-container-lowest ghost-border rounded-xl overflow-hidden">
            {PAGE_SLUGS.map(p => (
              <button
                key={p.slug}
                onClick={() => selectSlug(p.slug)}
                className={`w-full text-left px-5 py-3.5 text-sm font-medium border-b border-border last:border-0 transition-colors ${activeSlug === p.slug ? "bg-primary text-white font-bold" : "hover:bg-surface text-foreground"}`}
              >
                <div className="font-bold text-xs truncate">{p.label}</div>
                <div className={`text-xs truncate mt-0.5 ${activeSlug === p.slug ? "text-white/60" : "text-muted-foreground"}`}>{p.slug}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-6">
          <div className="bg-surface-container-lowest ghost-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">Meta Tags</h2>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-primary tracking-[0.12em] uppercase">Meta Title</label>
                {charCount(form.metaTitle ?? "", 60)}
              </div>
              <input type="text" value={form.metaTitle ?? ""} onChange={e => set("metaTitle", e.target.value)} className={inputBase} placeholder="Leave blank to use page default" />
              <p className="text-xs text-muted-foreground mt-1.5">Recommended: 50–60 characters</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-primary tracking-[0.12em] uppercase">Meta Description</label>
                {charCount(form.metaDescription ?? "", 160)}
              </div>
              <textarea value={form.metaDescription ?? ""} onChange={e => set("metaDescription", e.target.value)} rows={3} className={`${inputBase} resize-none`} placeholder="Leave blank to use page default" />
              <p className="text-xs text-muted-foreground mt-1.5">Recommended: 120–160 characters</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">Canonical URL</label>
              <input type="text" value={form.canonicalUrl ?? ""} onChange={e => set("canonicalUrl", e.target.value)} className={inputBase} placeholder="https://precisefect.com/..." />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.noIndex ?? false} onChange={e => set("noIndex", e.target.checked)} className="w-5 h-5 rounded" />
              <div>
                <div className="text-sm font-bold text-primary">No Index</div>
                <div className="text-xs text-muted-foreground">Prevent search engines from indexing this page</div>
              </div>
            </label>
          </div>

          <div className="bg-surface-container-lowest ghost-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">Open Graph (Social Sharing)</h2>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-primary tracking-[0.12em] uppercase">OG Title</label>
                {charCount(form.ogTitle ?? "", 70)}
              </div>
              <input type="text" value={form.ogTitle ?? ""} onChange={e => set("ogTitle", e.target.value)} className={inputBase} placeholder="Falls back to Meta Title" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-primary tracking-[0.12em] uppercase">OG Description</label>
                {charCount(form.ogDescription ?? "", 200)}
              </div>
              <textarea value={form.ogDescription ?? ""} onChange={e => set("ogDescription", e.target.value)} rows={2} className={`${inputBase} resize-none`} placeholder="Falls back to Meta Description" />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">OG Image URL</label>
              <input type="text" value={form.ogImageUrl ?? ""} onChange={e => set("ogImageUrl", e.target.value)} className={inputBase} placeholder="https://..." />
              <p className="text-xs text-muted-foreground mt-1.5">Recommended: 1200×630px</p>
            </div>

            {form.ogImageUrl && (
              <div className="rounded-lg overflow-hidden border border-border aspect-video max-w-sm bg-surface-container-high flex items-center justify-center">
                <img src={form.ogImageUrl} alt="OG preview" className="object-cover w-full h-full" onError={e => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="signature-gradient text-white font-bold rounded-lg px-8 py-4 btn-press inline-flex items-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {save.isPending ? "Saving…" : "Save SEO"}
            </button>
            <a href={activeSlug} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> View Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
