import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { cmsPublic } from "@/lib/cms-public";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  slug?: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function injectOrUpdateScript(id: string, src: string, extraAttrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  Object.entries(extraAttrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function injectInlineScript(id: string, code: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.textContent = code;
  document.head.appendChild(s);
}

function injectMetaTag(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo({
  title,
  description,
  image = "https://precisefect.com/og-image.jpg",
  url = "https://precisefect.com",
  slug,
}: SeoProps) {
  // Fetch live CMS SEO override for this page slug
  const { data: seoOverride } = useQuery({
    queryKey: ["seo", slug ?? ""],
    queryFn: () => cmsPublic.getSeo(slug ?? ""),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch site settings (GA4 ID, Search Console verification tag)
  const { data: settings = [] } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => cmsPublic.getSettings(),
    staleTime: 1000 * 60 * 5,
  });

  const finalTitle = seoOverride?.metaTitle || title;
  const finalDescription = seoOverride?.metaDescription || description;
  const finalOgTitle = seoOverride?.ogTitle || finalTitle;
  const finalOgDescription = seoOverride?.ogDescription || finalDescription;
  const finalOgImage = seoOverride?.ogImageUrl || image;
  const finalCanonical = seoOverride?.canonicalUrl || url;
  const noIndex = seoOverride?.noIndex ?? false;
  const fullTitle = `${finalTitle} | Precisefect Consulting`;

  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", finalDescription);
    setMeta("property", "og:title", finalOgTitle);
    setMeta("property", "og:description", finalOgDescription);
    setMeta("property", "og:image", finalOgImage);
    setMeta("property", "og:url", finalCanonical);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", finalOgTitle);
    setMeta("name", "twitter:description", finalOgDescription);
    setMeta("name", "twitter:image", finalOgImage);
    if (noIndex) setMeta("name", "robots", "noindex,nofollow");

    // Google Analytics 4
    const ga4Id = settings.find(s => s.key === "ga4MeasurementId")?.value;
    if (ga4Id && ga4Id.startsWith("G-")) {
      injectOrUpdateScript("gtag-js", `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
      injectInlineScript("gtag-init", `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`);
    }

    // Google Search Console verification
    const gscVerification = settings.find(s => s.key === "googleSearchConsoleVerification")?.value;
    if (gscVerification) injectMetaTag("google-site-verification", gscVerification);
  }, [fullTitle, finalDescription, finalOgTitle, finalOgDescription, finalOgImage, finalCanonical, noIndex, settings]);

  return null;
}
