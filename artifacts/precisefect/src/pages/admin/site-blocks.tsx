import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ExternalLink, Plus, Trash2 } from "lucide-react";
import { cmsApi, type NavbarContent, type FooterContent } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";
import { RevisionsPanel } from "@/components/admin/revisions-panel";
import { withPreviewQuery } from "@/hooks/use-preview";

const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground text-sm";

type FooterLink = { label: string; href: string };

export default function SiteBlocksEditor() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [navbar, setNavbar] = useState<NavbarContent>({ links: [], ctaLabel: "", ctaHref: "" });
  const [footer, setFooter] = useState<FooterContent>({ tagline: "", columns: [], legalLinks: [], copyright: "" });
  const [navbarId, setNavbarId] = useState<number | null>(null);
  const [footerId, setFooterId] = useState<number | null>(null);

  const { data: blocks = [] } = useQuery({
    queryKey: ["site-blocks", "admin"],
    queryFn: () => cmsApi.getSiteBlocks(["navbar", "footer"], "admin"),
  });

  useEffect(() => {
    const nav = blocks.find((b) => b.blockType === "navbar");
    const foot = blocks.find((b) => b.blockType === "footer");
    if (nav) {
      setNavbarId(nav.id);
      setNavbar(nav.content as unknown as NavbarContent);
    }
    if (foot) {
      setFooterId(foot.id);
      setFooter(foot.content as unknown as FooterContent);
    }
  }, [blocks]);

  const saveNavbar = useMutation({
    mutationFn: () => cmsApi.updateSiteBlock("navbar", { content: navbar as unknown as Record<string, unknown> }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-blocks"] }); toast({ title: "Navbar saved" }); },
    onError: (e) => toast({ title: "Save failed", description: String(e), variant: "destructive" }),
  });

  const saveFooter = useMutation({
    mutationFn: () => cmsApi.updateSiteBlock("footer", { content: footer as unknown as Record<string, unknown> }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site-blocks"] }); toast({ title: "Footer saved" }); },
    onError: (e) => toast({ title: "Save failed", description: String(e), variant: "destructive" }),
  });

  const updateColumnLinks = (colIndex: number, links: FooterLink[]) => {
    const columns = [...footer.columns];
    columns[colIndex] = { ...columns[colIndex], links, items: links };
    setFooter({ ...footer, columns });
  };

  const getColumnLinks = (col: FooterContent["columns"][number]): FooterLink[] =>
    col.links ?? col.items ?? [];

  return (
    <div className="max-w-3xl mx-auto px-8 py-16 space-y-12">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em]">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Console
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-primary">Site Navigation</h1>
        <a href={withPreviewQuery("/")} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-primary gap-1.5">
          <ExternalLink className="w-3.5 h-3.5" /> Preview site
        </a>
      </div>

      <section className="bg-surface-container-lowest ghost-border rounded-xl p-8 space-y-6">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">Navbar Links</h2>
        {navbar.links.map((link, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <input className={inputBase} value={link.label} placeholder="Label" onChange={(e) => {
              const next = [...navbar.links]; next[i] = { ...next[i], label: e.target.value }; setNavbar({ ...navbar, links: next });
            }} />
            <input className={inputBase} value={link.href} placeholder="/path" onChange={(e) => {
              const next = [...navbar.links]; next[i] = { ...next[i], href: e.target.value }; setNavbar({ ...navbar, links: next });
            }} />
          </div>
        ))}
        <button type="button" onClick={() => setNavbar({ ...navbar, links: [...navbar.links, { label: "", href: "" }] })} className="text-xs font-bold text-primary">+ Add link</button>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputBase} value={navbar.ctaLabel} placeholder="CTA label" onChange={(e) => setNavbar({ ...navbar, ctaLabel: e.target.value })} />
          <input className={inputBase} value={navbar.ctaHref} placeholder="CTA href" onChange={(e) => setNavbar({ ...navbar, ctaHref: e.target.value })} />
        </div>
        <button onClick={() => saveNavbar.mutate()} className="signature-gradient text-white font-bold rounded-lg px-6 py-3 inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Navbar
        </button>
        {navbarId && (
          <RevisionsPanel entityType="site-block:navbar" entityId={navbarId} onRestore={(s) => setNavbar((s.content ?? s) as unknown as NavbarContent)} />
        )}
      </section>

      <section className="bg-surface-container-lowest ghost-border rounded-xl p-8 space-y-6">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em]">Footer</h2>
        <textarea className={`${inputBase} min-h-[100px]`} value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} placeholder="Tagline" />
        <input className={inputBase} value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} placeholder="Copyright line" />

        <div className="space-y-6 pt-4 border-t border-border">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Footer Columns</h3>
          {footer.columns.map((col, colIndex) => (
            <div key={colIndex} className="bg-surface ghost-border rounded-xl p-4 space-y-3">
              <input
                className={inputBase}
                value={col.title}
                placeholder="Column title"
                onChange={(e) => {
                  const columns = [...footer.columns];
                  columns[colIndex] = { ...columns[colIndex], title: e.target.value };
                  setFooter({ ...footer, columns });
                }}
              />
              {getColumnLinks(col).map((link, linkIndex) => (
                <div key={linkIndex} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    className={inputBase}
                    value={link.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const links = [...getColumnLinks(col)];
                      links[linkIndex] = { ...links[linkIndex], label: e.target.value };
                      updateColumnLinks(colIndex, links);
                    }}
                  />
                  <input
                    className={inputBase}
                    value={link.href}
                    placeholder="/path or mailto:"
                    onChange={(e) => {
                      const links = [...getColumnLinks(col)];
                      links[linkIndex] = { ...links[linkIndex], href: e.target.value };
                      updateColumnLinks(colIndex, links);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => updateColumnLinks(colIndex, getColumnLinks(col).filter((_, i) => i !== linkIndex))}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateColumnLinks(colIndex, [...getColumnLinks(col), { label: "", href: "" }])}
                className="text-xs font-bold text-primary"
              >
                + Add link
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFooter({ ...footer, columns: [...footer.columns, { title: "", links: [] }] })}
            className="inline-flex items-center text-xs font-bold text-primary gap-1"
          >
            <Plus className="w-3 h-3" /> Add column
          </button>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Legal Links</h3>
          {footer.legalLinks.map((link, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input className={inputBase} value={link.label} placeholder="Label" onChange={(e) => {
                const legalLinks = [...footer.legalLinks];
                legalLinks[i] = { ...legalLinks[i], label: e.target.value };
                setFooter({ ...footer, legalLinks });
              }} />
              <input className={inputBase} value={link.href} placeholder="/privacy" onChange={(e) => {
                const legalLinks = [...footer.legalLinks];
                legalLinks[i] = { ...legalLinks[i], href: e.target.value };
                setFooter({ ...footer, legalLinks });
              }} />
              <button type="button" onClick={() => setFooter({ ...footer, legalLinks: footer.legalLinks.filter((_, idx) => idx !== i) })} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setFooter({ ...footer, legalLinks: [...footer.legalLinks, { label: "", href: "" }] })} className="text-xs font-bold text-primary">+ Add legal link</button>
        </div>

        <button onClick={() => saveFooter.mutate()} className="signature-gradient text-white font-bold rounded-lg px-6 py-3 inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Footer
        </button>
        {footerId && (
          <RevisionsPanel entityType="site-block:footer" entityId={footerId} onRestore={(s) => setFooter((s.content ?? s) as unknown as FooterContent)} />
        )}
      </section>
    </div>
  );
}
