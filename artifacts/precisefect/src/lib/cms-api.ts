export type BlogPost = {
  id: number; slug: string; title: string; excerpt: string; body: string;
  category: string; author: string; readTime: string; publishedAt: string;
  isPublished: boolean; createdAt: string; updatedAt: string;
};

export type CaseStudyMetric = {
  label: string; value: string; icon: "TrendingUp" | "Clock" | "BarChart" | "Zap" | "Shield" | "Users";
};

export type CaseStudy = {
  id: number; slug: string; client: string; industry: string; title: string;
  problem: string; solution: string; results: string; metrics: CaseStudyMetric[];
  sortOrder: number; publishedAt: string; isPublished: boolean; createdAt: string; updatedAt: string;
};

export type Faq = {
  id: number; question: string; answer: string; sortOrder: number; publishedAt: string;
  isPublished: boolean; createdAt: string; updatedAt: string;
};

export type TeamMember = {
  id: number; name: string; role: string; bio: string; imageUrl: string;
  linkedinUrl: string; sortOrder: number; publishedAt: string; isPublished: boolean;
  createdAt: string; updatedAt: string;
};

export type JobOpening = {
  id: number; title: string; location: string; employmentType: string;
  description: string; applyUrl: string; sortOrder: number; publishedAt: string;
  isPublished: boolean; createdAt: string; updatedAt: string;
};

export type Testimonial = {
  id: number; quote: string; authorName: string; authorRole: string;
  authorCompany: string; sortOrder: number; publishedAt: string; isPublished: boolean;
  createdAt: string; updatedAt: string;
};

export type SeoPage = {
  id: number; slug: string; metaTitle: string; metaDescription: string;
  ogTitle: string; ogDescription: string; ogImageUrl: string;
  canonicalUrl: string; noIndex: boolean; updatedAt: string;
};

export type SiteSetting = {
  id: number; key: string; value: string; label: string;
  description: string; updatedAt: string;
};

export type CustomPage = {
  id: number; slug: string; title: string; pageType: string;
  heroHeadline: string; heroSubheadline: string; heroCtaText: string; heroCtaUrl: string;
  bodyContent: string; listItems: Array<{ title: string; description: string }>;
  metaTitle: string; metaDescription: string; sortOrder: number; publishedAt: string;
  isPublished: boolean; createdAt: string; updatedAt: string;
};

export type Asset = {
  id: number; filename: string; storagePath: string; publicUrl: string;
  mimeType: string; sizeBytes: number; createdAt: string;
};

export type ContentRevision = {
  id: number; entityType: string; entityId: number;
  snapshot: Record<string, unknown>; operation: string;
  createdBy: string; createdAt: string;
};

export type SitePage = {
  id: number; path: string; title: string;
  heroEyebrow: string; heroHeadline: string; heroSubheadline: string;
  bodyContent: string; metaTitle: string; metaDescription: string;
  publishedAt: string; isPublished: boolean;
  createdAt: string; updatedAt: string;
};

export type SiteBlock = {
  id: number; blockType: string; content: Record<string, unknown>;
  isPublished: boolean; publishedAt: string; updatedAt: string;
};

export type NavbarContent = {
  links: Array<{ label: string; href: string }>;
  ctaLabel: string;
  ctaHref: string;
};

export type FooterContent = {
  tagline: string;
  columns: Array<{
    title: string;
    links?: Array<{ label: string; href: string }>;
    items?: Array<{ label: string; href: string }>;
  }>;
  legalLinks: Array<{ label: string; href: string }>;
  copyright: string;
};

export const COLLECTIONS = [
  "blog-posts", "case-studies", "faqs", "team-members", "job-openings", "testimonials",
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

const API_BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function scopeQuery(scope?: "admin" | "preview"): string {
  if (scope === "admin") return "?scope=admin";
  if (scope === "preview") return "?preview=1";
  return "";
}

export const cmsApi = {
  me: () => request<{ isAdmin: boolean }>("/auth/me"),
  login: (password: string) =>
    request<{ ok: true }>("/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),

  list: <T>(collection: CollectionName, scope?: "admin" | "preview") =>
    request<T[]>(`/${collection}${scopeQuery(scope)}`),
  get: <T>(collection: CollectionName, id: number, scope?: "admin" | "preview") =>
    request<T>(`/${collection}/${id}${scopeQuery(scope)}`),
  create: <T>(collection: CollectionName, data: Partial<T>) =>
    request<T>(`/${collection}`, { method: "POST", body: JSON.stringify(data) }),
  update: <T>(collection: CollectionName, id: number, data: Partial<T>) =>
    request<T>(`/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (collection: CollectionName, id: number) =>
    request<{ ok: true }>(`/${collection}/${id}`, { method: "DELETE" }),

  getBlogPostBySlug: (slug: string, scope?: "admin" | "preview") =>
    request<BlogPost>(`/blog-posts/by-slug/${slug}${scopeQuery(scope)}`),

  getSeo: (slug: string) => request<SeoPage | null>(`/seo?slug=${encodeURIComponent(slug)}`),
  getAllSeo: () => request<SeoPage[]>("/seo/all"),
  upsertSeo: (data: Partial<SeoPage>) =>
    request<SeoPage>("/seo", { method: "PUT", body: JSON.stringify(data) }),

  getSettings: () => request<SiteSetting[]>("/settings"),
  updateSetting: (key: string, value: string) =>
    request<SiteSetting>(`/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),

  listCustomPages: (scope?: "admin" | "preview") =>
    request<CustomPage[]>(`/custom-pages${scopeQuery(scope)}`),
  getCustomPage: (id: number, scope?: "admin" | "preview") =>
    request<CustomPage>(`/custom-pages/${id}${scopeQuery(scope)}`),
  getCustomPageBySlug: (slug: string, scope?: "admin" | "preview") =>
    request<CustomPage>(`/custom-pages/by-slug/${slug}${scopeQuery(scope)}`),
  createCustomPage: (data: Partial<CustomPage>) =>
    request<CustomPage>("/custom-pages", { method: "POST", body: JSON.stringify(data) }),
  updateCustomPage: (id: number, data: Partial<CustomPage>) =>
    request<CustomPage>(`/custom-pages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCustomPage: (id: number) =>
    request<{ ok: true }>(`/custom-pages/${id}`, { method: "DELETE" }),

  listAssets: (query?: string) =>
    request<Asset[]>(`/assets${query ? `?query=${encodeURIComponent(query)}` : ""}`),
  uploadAsset: async (file: File): Promise<Asset> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/assets/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) throw new Error(`${res.status}: upload failed`);
    return res.json() as Promise<Asset>;
  },

  listRevisions: (entityType: string, entityId: number) =>
    request<ContentRevision[]>(`/revisions?entityType=${encodeURIComponent(entityType)}&entityId=${entityId}`),
  getRevision: (id: number) => request<ContentRevision>(`/revisions/${id}`),

  getSiteBlocks: (types: string[], scope?: "admin" | "preview") =>
    request<SiteBlock[]>(`/site-blocks?types=${types.join(",")}${scope === "admin" ? "&scope=admin" : scope === "preview" ? "&preview=1" : ""}`),
  updateSiteBlock: (blockType: string, data: { content: Record<string, unknown>; isPublished?: boolean; publishedAt?: string }) =>
    request<SiteBlock>(`/site-blocks/${blockType}`, { method: "PUT", body: JSON.stringify(data) }),

  listSitePages: (scope?: "admin" | "preview") =>
    request<SitePage[]>(`/site-pages${scopeQuery(scope)}`),
  getSitePageContent: (path: string, scope?: "admin" | "preview") =>
    request<SitePage>(`/site-pages/content?path=${encodeURIComponent(path)}${scope === "preview" ? "&preview=1" : scope === "admin" ? "&scope=admin" : ""}`),
  upsertSitePage: (data: Partial<SitePage> & { path: string; title: string }) =>
    request<SitePage>("/site-pages/content", { method: "PUT", body: JSON.stringify(data) }),
};
