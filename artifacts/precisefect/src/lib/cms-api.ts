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
  sortOrder: number; isPublished: boolean; createdAt: string; updatedAt: string;
};

export type Faq = {
  id: number; question: string; answer: string; sortOrder: number;
  isPublished: boolean; createdAt: string; updatedAt: string;
};

export type TeamMember = {
  id: number; name: string; role: string; bio: string; imageUrl: string;
  linkedinUrl: string; sortOrder: number; isPublished: boolean;
  createdAt: string; updatedAt: string;
};

export type JobOpening = {
  id: number; title: string; location: string; employmentType: string;
  description: string; applyUrl: string; sortOrder: number; isPublished: boolean;
  createdAt: string; updatedAt: string;
};

export type Testimonial = {
  id: number; quote: string; authorName: string; authorRole: string;
  authorCompany: string; sortOrder: number; isPublished: boolean;
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
  metaTitle: string; metaDescription: string; sortOrder: number;
  isPublished: boolean; createdAt: string; updatedAt: string;
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

export const cmsApi = {
  me: () => request<{ isAdmin: boolean }>("/auth/me"),
  login: (password: string) =>
    request<{ ok: true }>("/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),

  list: <T>(collection: CollectionName, scope?: "admin") =>
    request<T[]>(`/${collection}${scope ? `?scope=${scope}` : ""}`),
  get: <T>(collection: CollectionName, id: number) => request<T>(`/${collection}/${id}`),
  create: <T>(collection: CollectionName, data: Partial<T>) =>
    request<T>(`/${collection}`, { method: "POST", body: JSON.stringify(data) }),
  update: <T>(collection: CollectionName, id: number, data: Partial<T>) =>
    request<T>(`/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (collection: CollectionName, id: number) =>
    request<{ ok: true }>(`/${collection}/${id}`, { method: "DELETE" }),

  // SEO
  getSeo: (slug: string) => request<SeoPage | null>(`/seo?slug=${encodeURIComponent(slug)}`),
  getAllSeo: () => request<SeoPage[]>("/seo/all"),
  upsertSeo: (data: Partial<SeoPage>) =>
    request<SeoPage>("/seo", { method: "PUT", body: JSON.stringify(data) }),

  // Settings
  getSettings: () => request<SiteSetting[]>("/settings"),
  updateSetting: (key: string, value: string) =>
    request<SiteSetting>(`/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),

  // Custom pages
  listCustomPages: (scope?: "admin") =>
    request<CustomPage[]>(`/custom-pages${scope ? `?scope=${scope}` : ""}`),
  getCustomPage: (id: number) => request<CustomPage>(`/custom-pages/${id}`),
  getCustomPageBySlug: (slug: string) => request<CustomPage>(`/custom-pages/by-slug/${slug}`),
  createCustomPage: (data: Partial<CustomPage>) =>
    request<CustomPage>("/custom-pages", { method: "POST", body: JSON.stringify(data) }),
  updateCustomPage: (id: number, data: Partial<CustomPage>) =>
    request<CustomPage>(`/custom-pages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCustomPage: (id: number) =>
    request<{ ok: true }>(`/custom-pages/${id}`, { method: "DELETE" }),
};
