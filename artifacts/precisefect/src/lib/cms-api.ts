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
  createdBy: string; createdById?: number | null; createdAt: string;
};

export type ActivityEvent = {
  id: number;
  actorUserId: number | null;
  action: string;
  entityType: string | null;
  entityId: number | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AdminUser = {
  id: number;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  roles: Array<{ key: string; label: string }>;
};

export type ModuleInfo = {
  id: number;
  key: string;
  label: string;
  isEnabled: boolean;
  config: Record<string, unknown>;
  updatedAt: string;
};

export type AuthMe = {
  isAdmin: boolean;
  userId: number | null;
  displayName: string | null;
  roles: string[];
  permissions: string[];
};

export type AutomationRule = {
  id: number;
  name: string;
  enabled: boolean;
  triggerType: string;
  triggerEvent: string;
  triggerSchedule: string | null;
  conditions: Record<string, unknown>;
  actions: Array<Record<string, unknown>>;
  moduleKey: string;
  createdAt: string;
  updatedAt: string;
};

export type AutomationRun = {
  id: number;
  ruleId: number | null;
  status: string;
  triggerPayload: Record<string, unknown>;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
};

export type IntegrationConnection = {
  id: number;
  provider: string;
  label: string;
  isEnabled: boolean;
  config: Record<string, unknown>;
  inboundToken: string | null;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
  hasSecrets: boolean;
  webhookUrl?: string;
};

export type IntegrationDelivery = {
  id: number;
  connectionId: number | null;
  direction: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: string;
  httpStatus: number | null;
  error: string | null;
  attempts: number;
  createdAt: string;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type LeadSource = "contact_form" | "whatsapp" | "manual" | "referral" | "other";

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  message: string;
  source: LeadSource;
  sourceDetail: string;
  status: LeadStatus;
  assignedToId: number | null;
  priority: string;
  score: number;
  scoreBreakdown: Record<string, number>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CrmTask = {
  id: number;
  leadId: number;
  title: string;
  dueAt: string | null;
  completedAt?: string | null;
  type: "call" | "email" | "follow_up" | "custom";
  status: "open" | "done" | "cancelled";
  assignedToId: number | null;
  createdAt: string;
  assigneeName?: string | null;
  leadName?: string;
};

export type TaskDashboard = {
  dueToday: number;
  overdue: number;
  tasks: CrmTask[];
};

export type LeadNote = {
  id: number;
  body: string;
  createdAt: string;
  authorUserId: number | null;
  authorDisplayName: string | null;
};

export type LeadStats = {
  byStatus: Record<LeadStatus, number>;
  unread: number;
  last7Days: number;
};

export type LeadDetail = {
  lead: Lead;
  notes: LeadNote[];
  timeline: ActivityEvent[];
  assignee: { id: number; displayName: string } | null;
  tasks: CrmTask[];
};

export type CreateLeadInput = {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
  company?: string;
  source?: LeadSource;
  sourceDetail?: string;
  website?: string;
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

import { cmsRequest as request, scopeQuery } from "./cms-http";

export const cmsApi = {
  me: () => request<AuthMe>("/auth/me"),
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
    const res = await fetch(`/api/assets/upload`, {
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

  listActivity: (limit = 50) =>
    request<ActivityEvent[]>(`/system/activity?limit=${limit}`),
  listUsers: () => request<AdminUser[]>("/system/users"),
  listModules: () => request<ModuleInfo[]>("/system/modules"),

  createLead: (data: CreateLeadInput) =>
    request<{ id: number; ok: true }>("/leads", { method: "POST", body: JSON.stringify(data) }),

  getLeadStats: () => request<LeadStats>("/leads/stats"),
  listLeads: (params?: {
    status?: LeadStatus;
    assignedTo?: string;
    q?: string;
    unreadOnly?: boolean;
    limit?: number;
    sort?: "score_desc" | "created_desc";
  }) => {
    const sp = new URLSearchParams();
    if (params?.status) sp.set("status", params.status);
    if (params?.assignedTo) sp.set("assignedTo", params.assignedTo);
    if (params?.q) sp.set("q", params.q);
    if (params?.unreadOnly) sp.set("unreadOnly", "true");
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.sort) sp.set("sort", params.sort);
    const qs = sp.toString();
    return request<Lead[]>(`/leads${qs ? `?${qs}` : ""}`);
  },
  getLead: (id: number) => request<LeadDetail>(`/leads/${id}`),
  updateLead: (id: number, data: Partial<Pick<Lead, "status" | "assignedToId" | "priority" | "isRead" | "company">>) =>
    request<Lead>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  addLeadNote: (id: number, body: string) =>
    request<{ id: number }>(`/leads/${id}/notes`, { method: "POST", body: JSON.stringify({ body }) }),
  createLeadAdmin: (data: CreateLeadInput & { source?: LeadSource }) =>
    request<Lead>("/leads/admin", { method: "POST", body: JSON.stringify(data) }),

  listAutomationRules: () => request<AutomationRule[]>("/automation/rules"),
  getAutomationRule: (id: number) => request<AutomationRule>(`/automation/rules/${id}`),
  createAutomationRule: (data: {
    name: string;
    triggerEvent: string;
    enabled?: boolean;
    conditions?: Record<string, unknown>;
    actions?: Array<Record<string, unknown>>;
    moduleKey?: string;
  }) =>
    request<AutomationRule>("/automation/rules", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAutomationRule: (
    id: number,
    data: Partial<{
      name: string;
      enabled: boolean;
      triggerEvent: string;
      conditions: Record<string, unknown>;
      actions: Array<Record<string, unknown>>;
    }>,
  ) =>
    request<AutomationRule>(`/automation/rules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteAutomationRule: (id: number) =>
    request<{ ok: true }>(`/automation/rules/${id}`, { method: "DELETE" }),
  listAutomationRuns: (limit = 30) =>
    request<AutomationRun[]>(`/automation/runs?limit=${limit}`),

  getTaskDashboard: () => request<TaskDashboard>("/tasks/dashboard"),
  listLeadTasks: (leadId: number) => request<CrmTask[]>(`/leads/${leadId}/tasks`),
  createLeadTask: (
    leadId: number,
    data: { title: string; dueAt?: string | null; type?: CrmTask["type"] },
  ) =>
    request<CrmTask>(`/leads/${leadId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTask: (
    id: number,
    data: Partial<{ title: string; dueAt: string | null; status: CrmTask["status"] }>,
  ) =>
    request<CrmTask>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  listIntegrationConnections: () =>
    request<IntegrationConnection[]>("/integrations/connections"),
  createIntegrationConnection: (data: {
    provider: "webhook" | "zapier" | "resend";
    label: string;
    isEnabled?: boolean;
    config?: Record<string, unknown>;
    secrets?: Record<string, string>;
  }) =>
    request<IntegrationConnection>("/integrations/connections", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateIntegrationConnection: (
    id: number,
    data: Partial<{
      label: string;
      isEnabled: boolean;
      config: Record<string, unknown>;
      secrets: Record<string, string>;
    }>,
  ) =>
    request<IntegrationConnection>(`/integrations/connections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteIntegrationConnection: (id: number) =>
    request<{ ok: true }>(`/integrations/connections/${id}`, { method: "DELETE" }),
  testIntegrationConnection: (id: number) =>
    request<{ ok: boolean; message: string }>(`/integrations/connections/${id}/test`, {
      method: "POST",
    }),
  listIntegrationDeliveries: (limit = 50, connectionId?: number) => {
    const sp = new URLSearchParams({ limit: String(limit) });
    if (connectionId != null) sp.set("connectionId", String(connectionId));
    return request<IntegrationDelivery[]>(`/integrations/deliveries?${sp}`);
  },
};
