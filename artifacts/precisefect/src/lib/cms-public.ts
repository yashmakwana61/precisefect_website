/**
 * Public-site API surface only — keeps admin/leads/automation code out of the marketing bundle.
 */
import { cmsRequest, scopeQuery } from "./cms-http";
import type {
  BlogPost,
  CollectionName,
  CreateLeadInput,
  CustomPage,
  SeoPage,
  SiteBlock,
  SitePage,
  SiteSetting,
} from "./cms-api";

export const cmsPublic = {
  getSeo: (slug: string) => cmsRequest<SeoPage | null>(`/seo?slug=${encodeURIComponent(slug)}`),

  getSettings: () => cmsRequest<SiteSetting[]>("/settings"),

  getSiteBlocks: (types: string[], scope?: "admin" | "preview") =>
    cmsRequest<SiteBlock[]>(
      `/site-blocks?types=${types.join(",")}${scope === "admin" ? "&scope=admin" : scope === "preview" ? "&preview=1" : ""}`,
    ),

  list: <T>(collection: CollectionName, scope?: "admin" | "preview") =>
    cmsRequest<T[]>(`/${collection}${scopeQuery(scope)}`),

  getBlogPostBySlug: (slug: string, scope?: "admin" | "preview") =>
    cmsRequest<BlogPost>(`/blog-posts/by-slug/${slug}${scopeQuery(scope)}`),

  getCustomPageBySlug: (slug: string, scope?: "admin" | "preview") =>
    cmsRequest<CustomPage>(`/custom-pages/by-slug/${slug}${scopeQuery(scope)}`),

  getSitePageContent: (path: string, scope?: "admin" | "preview") =>
    cmsRequest<SitePage>(
      `/site-pages/content?path=${encodeURIComponent(path)}${scope === "preview" ? "&preview=1" : scope === "admin" ? "&scope=admin" : ""}`,
    ),

  createLead: (data: CreateLeadInput) =>
    cmsRequest<{ id: number; ok: true }>("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
