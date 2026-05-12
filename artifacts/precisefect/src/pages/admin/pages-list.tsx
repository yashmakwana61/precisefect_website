import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cmsApi, type CustomPage } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";

const PAGE_TYPE_LABELS: Record<string, string> = {
  landing: "Landing Page",
  content: "Content Page",
  list: "Feature List",
};

export default function PagesList() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["custom-pages", "admin"],
    queryFn: () => cmsApi.listCustomPages("admin"),
  });

  const remove = useMutation({
    mutationFn: (id: number) => cmsApi.deleteCustomPage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["custom-pages"] });
      toast({ title: "Page deleted" });
    },
    onError: (e) => toast({ title: "Delete failed", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-16">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Console
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">{pages.length} pages</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-3">Custom Pages</h1>
          <p className="text-muted-foreground">Create new pages from design templates. Published pages appear at <code className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded">/p/slug</code></p>
        </div>
        <Link href="/admin/pages/new" className="signature-gradient text-white font-bold rounded-lg px-6 py-3 btn-press inline-flex items-center self-start">
          <Plus className="w-4 h-4 mr-2" /> New Page
        </Link>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : pages.length === 0 ? (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-16 text-center">
          <p className="text-muted-foreground mb-4">No custom pages yet.</p>
          <Link href="/admin/pages/new" className="text-primary font-bold underline">Create your first page</Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest ghost-border rounded-xl divide-y divide-border overflow-hidden">
          {pages.map((page: CustomPage) => (
            <div key={page.id} className="flex items-center justify-between gap-4 p-6 hover:bg-surface transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-primary truncate">{page.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-muted-foreground">
                    {PAGE_TYPE_LABELS[page.pageType] ?? page.pageType}
                  </span>
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
                <div className="text-xs text-muted-foreground">/p/{page.slug}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {page.isPublished && (
                  <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer"
                    className="p-2.5 rounded-lg bg-surface-container-high text-muted-foreground hover:text-primary transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <Link href={`/admin/pages/${page.id}`}
                  className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => confirm(`Delete "${page.title}"?`) && remove.mutate(page.id)}
                  className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-destructive hover:text-white transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
