import { useQuery } from "@tanstack/react-query";
import { cmsApi, type SitePage } from "@/lib/cms-api";
import { getSitePageDefaults, type SitePageDefaults } from "@/lib/site-page-registry";
import { usePreviewMode } from "@/hooks/use-preview";

export type MergedSitePage = SitePageDefaults & {
  id?: number;
  isPublished: boolean;
  publishedAt: string;
  hasOverride: boolean;
};

function mergePage(path: string, override?: SitePage | null): MergedSitePage {
  const defaults = getSitePageDefaults(path) ?? {
    path,
    title: path,
    heroEyebrow: "",
    heroHeadline: "",
    heroSubheadline: "",
    bodyContent: "",
    metaTitle: "",
    metaDescription: "",
  };

  if (!override) {
    return { ...defaults, isPublished: true, publishedAt: new Date().toISOString(), hasOverride: false };
  }

  return {
    path: defaults.path,
    title: override.title || defaults.title,
    heroEyebrow: override.heroEyebrow,
    heroHeadline: override.heroHeadline || defaults.heroHeadline,
    heroSubheadline: override.heroSubheadline || defaults.heroSubheadline,
    bodyContent: override.bodyContent,
    metaTitle: override.metaTitle || defaults.metaTitle,
    metaDescription: override.metaDescription || defaults.metaDescription,
    id: override.id,
    isPublished: override.isPublished,
    publishedAt: override.publishedAt,
    hasOverride: true,
  };
}

export function useSitePage(path: string) {
  const preview = usePreviewMode();
  const { data: override, isLoading, isError } = useQuery({
    queryKey: ["site-page", path, preview],
    queryFn: async () => {
      try {
        return await cmsApi.getSitePageContent(path, preview ? "preview" : undefined);
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const content = mergePage(path, override ?? undefined);
  return { content, isLoading, isError, hasOverride: Boolean(override) };
}
