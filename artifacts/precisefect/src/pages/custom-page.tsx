import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/seo";
import { cmsApi, type CustomPage } from "@/lib/cms-api";
import { HtmlSafe } from "@/components/html-safe";
import { usePreviewMode } from "@/hooks/use-preview";

type ListItem = { title: string; description: string };

function LandingTemplate({ page }: { page: CustomPage }) {
  return (
    <>
      <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,200,140,0.04),transparent_60%)]" />
        <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mb-20">
            <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Precisefect</p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[0.95]">{page.heroHeadline || page.title}</h1>
            {page.heroSubheadline && <p className="text-xl text-muted-foreground leading-relaxed">{page.heroSubheadline}</p>}
          </motion.div>
          {items.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
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

export default function CustomPageRenderer() {
  const params = useParams<{ slug: string }>();
  const preview = usePreviewMode();
  const { data: page, isLoading, isError } = useQuery({
    queryKey: ["custom-page", "slug", params.slug, preview],
    queryFn: () => cmsApi.getCustomPageBySlug(params.slug, preview ? "preview" : undefined),
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

  return (
    <>
      <Seo
        title={page.metaTitle || page.title}
        description={page.metaDescription || page.heroSubheadline || ""}
        slug={`/p/${page.slug}`}
      />
      {page.pageType === "content" && <ContentTemplate page={page} />}
      {page.pageType === "list" && <ListTemplate page={page} />}
      {(page.pageType === "landing" || !page.pageType) && <LandingTemplate page={page} />}
    </>
  );
}
