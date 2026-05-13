import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, Search } from "lucide-react";
import { cmsApi, type CustomPage, type SitePage } from "@/lib/cms-api";
import { SITE_PAGE_REGISTRY } from "@/lib/site-page-registry";
import { useToast } from "@/hooks/use-toast";
import { withPreviewQuery } from "@/hooks/use-preview";

const PAGE_TYPE_LABELS: Record<string, string> = {
  landing: "Landing",
  content: "Content",
  list: "List",
};

type PageRow = {
  key: string;
  path: string;
  title: string;
  kind: "builtin" | "custom";
  editHref: string;
  previewHref: string;
  liveHref: string;
  hasCmsContent: boolean;
  isPublished: boolean;
  customId?: number;
  pageType?: string;
};

export default function PagesList() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [query, setQuery] = useState("");

  const { data: customPages = [], isLoading: loadingCustom } = useQuery({
    queryKey: ["custom-pages", "admin"],
    queryFn: () => cmsApi.listCustomPages("admin"),
  });

  const { data: siteOverrides = [], isLoading: loadingBuiltin } = useQuery({
    queryKey: ["site-pages", "admin"],
    queryFn: () => cmsApi.listSitePages("admin"),
  });

  const overrideByPath = useMemo(() => {
    const map = new Map<string, SitePage>();
    for (const row of siteOverrides) map.set(row.path, row);
    return map;
  }, [siteOverrides]);

  const allPages = useMemo<PageRow[]>(() => {
    const builtin: PageRow[] = SITE_PAGE_REGISTRY.map((p) => {
      const override = overrideByPath.get(p.path);
      return {
        key: `builtin:${p.path}`,
        path: p.path,
        title: override?.title ?? p.title,
        kind: "builtin",
        editHref: `/admin/site-page?path=${encodeURIComponent(p.path)}`,
        previewHref: withPreviewQuery(p.path),
        liveHref: p.path,
        hasCmsContent: Boolean(override),
        isPublished: override ? override.isPublished : true,
      };
    });

    const custom: PageRow[] = customPages.map((page: CustomPage) => ({
      key: `custom:${page.id}`,
      path: `/p/${page.slug}`,
      title: page.title,
      kind: "custom",
      editHref: `/admin/pages/${page.id}`,
      previewHref: withPreviewQuery(`/p/${page.slug}`),
      liveHref: `/p/${page.slug}`,
      hasCmsContent: true,
      isPublished: page.isPublished,
      customId: page.id,
      pageType: page.pageType,
    }));

    return [...builtin, ...custom].sort((a, b) => a.path.localeCompare(b.path));
  }, [customPages, overrideByPath]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPages;
    return allPages.filter(
      (p) => p.path.toLowerCase().includes(q) || p.title.toLowerCase().includes(q),
    );
  }, [allPages, query]);

  const remove = useMutation({
    mutationFn: (id: number) => cmsApi.deleteCustomPage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["custom-pages"] });
      toast({ title: "Page deleted" });
    },
    onError: (e) => toast({ title: "Delete failed", description: String(e), variant: "destructive" }),
  });

  const isLoading = loadingCustom || loadingBuiltin;

  return (
    <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-16">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Console
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">{allPages.length} pages</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-3">All Pages</h1>
          <p className="text-muted-foreground max-w-2xl">
            Edit built-in site pages (e.g. <code className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded">/contact</code>) or custom pages at <code className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded">/p/slug</code>.
          </p>
        </div>
        <Link href="/admin/pages/new" className="signature-gradient text-white font-bold rounded-lg px-6 py-3 btn-press inline-flex items-center self-start">
          <Plus className="w-4 h-4 mr-2" /> New Custom Page
        </Link>
      </div>

      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by page URL or title… e.g. /contact"
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-16 text-center">
          <p className="text-muted-foreground">No pages match your search.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest ghost-border rounded-xl divide-y divide-border overflow-hidden">
          {filtered.map((page) => (
            <div key={page.key} className="flex items-center justify-between gap-4 p-6 hover:bg-surface transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-primary truncate">{page.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-muted-foreground">
                    {page.kind === "builtin" ? "Built-in" : PAGE_TYPE_LABELS[page.pageType ?? ""] ?? "Custom"}
                  </span>
                  {page.hasCmsContent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                      CMS
                    </span>
                  )}
                  {page.isPublished ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-on-primary-container/10 text-on-primary-container inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground inline-flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate">{page.path}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={page.previewHref} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-surface-container-high text-muted-foreground hover:text-primary transition-colors" title="Preview">
                  <ExternalLink className="w-4 h-4" />
                </a>
                {page.isPublished && (
                  <a href={page.liveHref} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-surface-container-high text-muted-foreground hover:text-primary transition-colors" title="View live">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <Link href={page.editHref} className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </Link>
                {page.kind === "custom" && page.customId && (
                  <button
                    onClick={() => confirm(`Delete "${page.title}"?`) && remove.mutate(page.customId!)}
                    className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-destructive hover:text-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
