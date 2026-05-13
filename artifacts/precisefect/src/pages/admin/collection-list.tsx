import { Link, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, EyeOff, Eye, ExternalLink } from "lucide-react";
import { cmsApi, type CollectionName } from "@/lib/cms-api";
import { collectionConfigs } from "./collection-config";
import { useToast } from "@/hooks/use-toast";
import { withPreviewQuery } from "@/hooks/use-preview";

function collectionPreviewUrl(collection: CollectionName, item: Record<string, unknown>): string | null {
  const slug = String(item.slug ?? "");
  if (collection === "blog-posts" && slug) return withPreviewQuery(`/blog/${slug}`);
  if (collection === "case-studies") return withPreviewQuery("/case-studies");
  if (collection === "faqs") return withPreviewQuery("/faq");
  if (collection === "job-openings") return withPreviewQuery("/careers");
  return null;
}

export default function CollectionList() {
  const params = useParams<{ collection: string }>();
  const collection = params.collection as CollectionName;
  const config = collectionConfigs[collection];
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["collection", collection, "admin"],
    queryFn: () => cmsApi.list<Record<string, unknown>>(collection, "admin"),
    enabled: !!config,
  });

  const remove = useMutation({
    mutationFn: (id: number) => cmsApi.remove(collection, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collection", collection] });
      qc.invalidateQueries({ queryKey: ["public", collection] });
      toast({ title: "Deleted" });
    },
    onError: (e) => toast({ title: "Delete failed", description: String(e), variant: "destructive" }),
  });

  if (!config) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-24">
        <h1 className="text-3xl font-bold text-primary">Unknown collection</h1>
        <Link href="/admin" className="text-primary-container underline">Return to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-16">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8" data-testid="link-back-to-dashboard">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Console
      </Link>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">
            {String(items.length)} entries
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-3">{config.name}</h1>
          <p className="text-muted-foreground max-w-2xl">{config.description}</p>
        </div>
        <Link
          href={`/admin/${collection}/new`}
          data-testid="link-create-new"
          className="signature-gradient text-white font-bold rounded-lg px-6 py-3 btn-press inline-flex items-center self-start"
        >
          <Plus className="w-4 h-4 mr-2" /> New {config.singularName}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-6">No entries yet.</p>
          <Link href={`/admin/${collection}/new`} className="text-primary font-bold underline">
            Create the first one
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest ghost-border rounded-xl divide-y divide-border overflow-hidden">
          {items.map((item) => {
            const id = Number(item.id);
            const published = Boolean(item.isPublished);
            return (
              <div
                key={id}
                data-testid={`row-item-${id}`}
                className="flex items-center justify-between gap-4 p-6 hover:bg-surface transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-primary truncate" data-testid={`text-title-${id}`}>
                      {config.listLabel(item)}
                    </span>
                    {!published && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground inline-flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                    {published && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-on-primary-container/10 text-on-primary-container inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Live
                      </span>
                    )}
                  </div>
                  {config.listSubLabel && (
                    <div className="text-xs text-muted-foreground truncate">{config.listSubLabel(item)}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {collectionPreviewUrl(collection, item) && (
                    <a
                      href={collectionPreviewUrl(collection, item)!}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-surface-container-high text-muted-foreground hover:text-primary transition-colors"
                      title="Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    href={`/admin/${collection}/${id}`}
                    data-testid={`link-edit-${id}`}
                    className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${config.listLabel(item)}"? This cannot be undone.`)) {
                        remove.mutate(id);
                      }
                    }}
                    data-testid={`button-delete-${id}`}
                    className="p-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-destructive hover:text-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
