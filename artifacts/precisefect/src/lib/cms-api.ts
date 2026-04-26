export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CaseStudyMetric = {
  label: string;
  value: string;
  icon: "TrendingUp" | "Clock" | "BarChart" | "Zap" | "Shield" | "Users";
};

export type CaseStudy = {
  id: number;
  slug: string;
  client: string;
  industry: string;
  title: string;
  problem: string;
  solution: string;
  results: string;
  metrics: CaseStudyMetric[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type JobOpening = {
  id: number;
  title: string;
  location: string;
  employmentType: string;
  description: string;
  applyUrl: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: number;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export const COLLECTIONS = [
  "blog-posts",
  "case-studies",
  "faqs",
  "team-members",
  "job-openings",
  "testimonials",
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
  // Auth
  me: () => request<{ isAdmin: boolean }>("/auth/me"),
  login: (password: string) =>
    request<{ ok: true }>("/auth/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),

  // Generic collection helpers
  list: <T>(collection: CollectionName, scope?: "admin") =>
    request<T[]>(`/${collection}${scope ? `?scope=${scope}` : ""}`),
  get: <T>(collection: CollectionName, id: number) => request<T>(`/${collection}/${id}`),
  create: <T>(collection: CollectionName, data: Partial<T>) =>
    request<T>(`/${collection}`, { method: "POST", body: JSON.stringify(data) }),
  update: <T>(collection: CollectionName, id: number, data: Partial<T>) =>
    request<T>(`/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (collection: CollectionName, id: number) =>
    request<{ ok: true }>(`/${collection}/${id}`, { method: "DELETE" }),
};
