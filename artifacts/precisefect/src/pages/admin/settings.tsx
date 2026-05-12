import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { cmsApi, type SiteSetting } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";

const SETTING_DEFS = [
  {
    group: "WhatsApp Chat",
    settings: [
      { key: "whatsappPhone", label: "WhatsApp Phone Number", description: "Include country code, no spaces or dashes. e.g. 14155552671", placeholder: "14155552671", type: "text" },
      { key: "whatsappMessage", label: "Pre-filled Message", description: "Default message shown when user opens WhatsApp chat.", placeholder: "Hello! I'd like to learn more about Precisefect.", type: "textarea" },
    ],
  },
  {
    group: "Google Analytics 4",
    settings: [
      { key: "ga4MeasurementId", label: "GA4 Measurement ID", description: "Found in GA4 → Admin → Data Streams. Format: G-XXXXXXXXXX", placeholder: "G-XXXXXXXXXX", type: "text" },
    ],
  },
  {
    group: "Google Search Console",
    settings: [
      { key: "googleSearchConsoleVerification", label: "Verification Meta Tag Content", description: "The content value from the HTML tag verification method in Search Console. e.g. abc123XYZ", placeholder: "abc123XYZ...", type: "text" },
      { key: "siteUrl", label: "Canonical Site URL", description: "Used in sitemap.xml generation. No trailing slash.", placeholder: "https://precisefect.com", type: "text" },
    ],
  },
];

const inputBase = "w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-container font-medium text-sm";

export default function AdminSettings() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const { data: settings = [] } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => cmsApi.getSettings(),
  });

  useEffect(() => {
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    setForm(map);
  }, [settings]);

  const saveSetting = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => cmsApi.updateSetting(key, value),
    onMutate: ({ key }) => setSaving(key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Setting saved" });
      setSaving(null);
    },
    onError: (e) => { toast({ title: "Save failed", description: String(e), variant: "destructive" }); setSaving(null); },
  });

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/admin" className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-[0.15em] mb-8">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Console
      </Link>

      <div className="mb-12">
        <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-3">Configuration</p>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-3">Site Settings</h1>
        <p className="text-muted-foreground">Manage integrations, chat widget, and analytics tracking.</p>
      </div>

      <div className="space-y-10">
        {SETTING_DEFS.map(group => (
          <div key={group.group} className="bg-surface-container-lowest ghost-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em] border-b border-border pb-4">{group.group}</h2>
            {group.settings.map(def => (
              <div key={def.key}>
                <label className="block text-xs font-bold text-primary tracking-[0.12em] uppercase mb-2">{def.label}</label>
                {def.type === "textarea" ? (
                  <textarea
                    value={form[def.key] ?? ""}
                    onChange={e => setForm(f => ({ ...f, [def.key]: e.target.value }))}
                    rows={3}
                    placeholder={def.placeholder}
                    className={`${inputBase} resize-none`}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[def.key] ?? ""}
                    onChange={e => setForm(f => ({ ...f, [def.key]: e.target.value }))}
                    placeholder={def.placeholder}
                    className={inputBase}
                  />
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{def.description}</p>
                  <button
                    onClick={() => saveSetting.mutate({ key: def.key, value: form[def.key] ?? "" })}
                    disabled={saving === def.key}
                    className="text-xs font-bold text-primary hover:text-primary-container inline-flex items-center gap-1 ml-4 shrink-0 disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" /> {saving === def.key ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Quick links */}
        <div className="bg-surface-container-lowest ghost-border rounded-xl p-8">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.15em] border-b border-border pb-4 mb-6">Quick Links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Sitemap.xml", href: "/api/sitemap.xml" },
              { label: "robots.txt", href: "/api/robots.txt" },
              { label: "Google Search Console", href: "https://search.google.com/search-console" },
              { label: "Google Analytics", href: "https://analytics.google.com" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-container transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
