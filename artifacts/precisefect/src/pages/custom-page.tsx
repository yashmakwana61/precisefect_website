import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { heroCopy, itemReveal } from "@/lib/motion-presets";
import { ArrowRight, Save, Edit, X } from "lucide-react";
import { Seo } from "@/components/seo";
import { cmsPublic } from "@/lib/cms-public";
import { cmsApi } from "@/lib/cms-api";
import type { CustomPage } from "@/lib/cms-api";
import { HtmlSafe } from "@/components/html-safe";
import { usePreviewMode } from "@/hooks/use-preview";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { WebstudioEditor } from "@/components/admin/webstudio-editor";

type ListItem = { title: string; description: string };

function LandingTemplate({ page }: { page: CustomPage }) {
  return (
    <>
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,200,140,0.04),transparent_60%)]" />
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...heroCopy} className="max-w-4xl">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Precisefect</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">
              {page.heroHeadline || page.title}
            </h1>
            {page.heroSubheadline && (
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl">{page.heroSubheadline}</p>
            )}
            {page.heroCtaText && page.heroCtaUrl && (
              <Link href={page.heroCtaUrl}>
                <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 shadow-md btn-press text-lg inline-flex items-center">
                  {page.heroCtaText} <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      {page.bodyContent && (
        <section className="py-24 bg-surface-container-lowest border-y border-border">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-3xl">
            <div className="prose prose-lg text-muted-foreground leading-relaxed"><HtmlSafe html={page.bodyContent} /></div>
          </div>
        </section>
      )}
    </>
  );
}

function ContentTemplate({ page }: { page: CustomPage }) {
  return (
    <>
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-4xl">
          <motion.div {...heroCopy}>
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Precisefect</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">{page.heroHeadline || page.title}</h1>
            {page.heroSubheadline && (
              <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-on-primary-container pl-6">{page.heroSubheadline}</p>
            )}
          </motion.div>
        </div>
      </section>
      {page.bodyContent && (
        <section className="py-16 pb-32 bg-surface">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16 max-w-3xl">
            <div className="text-lg text-muted-foreground leading-relaxed"><HtmlSafe html={page.bodyContent} /></div>
          </div>
        </section>
      )}
    </>
  );
}

function ListTemplate({ page }: { page: CustomPage }) {
  const items = (page.listItems ?? []) as ListItem[];
  return (
    <>
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div {...heroCopy} className="max-w-3xl mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Precisefect</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">{page.heroHeadline || page.title}</h1>
            {page.heroSubheadline && <p className="text-xl text-muted-foreground leading-relaxed">{page.heroSubheadline}</p>}
          </motion.div>
          {items.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  {...itemReveal(i)}
                  className="bg-surface-container-lowest ghost-border rounded-xl p-8"
                >
                  <div className="w-8 h-8 rounded-full bg-on-primary-container/10 flex items-center justify-center text-on-primary-container font-bold text-sm mb-5">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          )}
          {page.heroCtaText && page.heroCtaUrl && (
            <div className="mt-16 text-center">
              <Link href={page.heroCtaUrl}>
                <button className="signature-gradient text-white font-bold rounded-lg px-10 py-5 btn-press text-lg">
                  {page.heroCtaText}
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function GrapesTemplate({ page }: { page: CustomPage }) {
  return (
    <div className="w-full min-h-[60vh]">
      <HtmlSafe html={page.bodyContent} />
    </div>
  );
}

export default function CustomPageRenderer() {
  const params = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const preview = usePreviewMode();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setIsEditing(searchParams.get("edit") === "true");
  }, [window.location.search]);

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["custom-page", "slug", params.slug, preview],
    queryFn: () => cmsPublic.getCustomPageBySlug(params.slug, preview ? "preview" : undefined),
  });

  // Local editor states
  const [editForm, setEditForm] = useState<Partial<CustomPage>>({});

  useEffect(() => {
    if (page) {
      setEditForm({ ...page });
    }
  }, [page]);

  const saveMutation = useMutation({
    mutationFn: () => cmsApi.updateCustomPage(page!.id, editForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["custom-page", "slug", params.slug] });
      toast({ title: "Page Saved Successfully", description: "Your dynamic site updates are now live!" });
    },
    onError: (e) => toast({ title: "Save Failed", description: String(e), variant: "destructive" }),
  });

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (isError || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">This page doesn't exist or hasn't been published yet.</p>
        <Link href="/" className="text-primary font-bold underline">Go Home</Link>
      </div>
    );
  }

  // Render Visual Webstudio Editor Inline
  if (isEditing && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative z-[9999]">
        {/* Sticky top control panel */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-[10000] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">In-Context Live Editor</span>
              <h2 className="text-sm font-bold text-slate-100 mt-0.5">{page.title} ({page.slug})</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-lg px-5 py-2.5 text-xs shadow-lg transition-colors flex items-center shrink-0"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saveMutation.isPending ? "Saving..." : "Save Page"}
            </button>
            <button
              onClick={() => setLocation(location.split("?")[0])}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg px-5 py-2.5 text-xs border border-slate-700 transition-colors flex items-center shrink-0"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Close Editor
            </button>
          </div>
        </div>

        {/* Webstudio Editor Container */}
        <div className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
          <WebstudioEditor
            initialHtml={editForm.bodyContent ?? ""}
            initialProjectData={editForm.grapesJson}
            onChange={(html, json) => {
              setEditForm(f => ({ ...f, bodyContent: html, grapesJson: json }));
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={page.metaTitle || page.title}
        description={page.metaDescription || page.heroSubheadline || ""}
        slug={`/p/${page.slug}`}
      />
      {page.pageType === "grapes" && <GrapesTemplate page={page} />}
      {page.pageType === "content" && <ContentTemplate page={page} />}
      {page.pageType === "list" && <ListTemplate page={page} />}
      {(page.pageType === "landing" || !page.pageType) && <LandingTemplate page={page} />}

      {/* Floating In-Context Admin Edit Action Button */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-[999]">
          <button
            onClick={() => setLocation(`${location}?edit=true`)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group border border-emerald-400/20"
          >
            <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-xs uppercase tracking-wider">Live Edit Page</span>
          </button>
        </div>
      )}
    </>
  );
}
