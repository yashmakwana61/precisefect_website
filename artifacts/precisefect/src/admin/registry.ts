import type { CollectionName } from "@/lib/cms-api";
import {
  FileText,
  Briefcase,
  HelpCircle,
  Users,
  Building2,
  Quote,
  Search,
  Settings,
  LayoutTemplate,
  Navigation,
  Image,
  Activity,
  Shield,
  Inbox,
  Workflow,
  Plug,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  name: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
};

export const LEADS_NAV: AdminNavItem[] = [
  { href: "/admin/leads", name: "All leads", description: "Pipeline and inquiries from the website.", icon: Inbox },
  { href: "/admin/leads/kanban", name: "Pipeline board", description: "Kanban view by lead status.", icon: Inbox },
];

export const CONTENT_COLLECTIONS: {
  slug: CollectionName;
  name: string;
  description: string;
  icon: LucideIcon;
}[] = [
  { slug: "blog-posts", name: "Blog Posts", description: "Field notes, technical essays, and architectural insights.", icon: FileText },
  { slug: "case-studies", name: "Case Studies", description: "Client outcomes with metrics, problem, solution, and results.", icon: Building2 },
  { slug: "faqs", name: "FAQs", description: "Operational protocol questions answered for prospects.", icon: HelpCircle },
  { slug: "team-members", name: "Team", description: "The engineers, architects, and operators behind the firm.", icon: Users },
  { slug: "job-openings", name: "Careers", description: "Open positions and engineering roles.", icon: Briefcase },
  { slug: "testimonials", name: "Testimonials", description: "Quoted endorsements from clients.", icon: Quote },
];

export const SITE_TOOLS: AdminNavItem[] = [
  { href: "/admin/site/site-blocks", name: "Navigation & Footer", description: "Edit navbar links, CTA button, and footer columns.", icon: Navigation },
  { href: "/admin/site/pages", name: "All Pages", description: "Search and edit every site page by URL.", icon: LayoutTemplate },
  { href: "/admin/site/seo", name: "SEO Management", description: "Override meta tags, Open Graph data, and indexing rules per page.", icon: Search },
];

export const SYSTEM_TOOLS: AdminNavItem[] = [
  { href: "/admin/system/settings", name: "Site Settings", description: "WhatsApp, GA4, Search Console, and site URL.", icon: Settings },
  { href: "/admin/system/automation", name: "Automation", description: "Event rules for leads — email, assign, webhooks.", icon: Workflow },
  { href: "/admin/system/integrations", name: "Integrations", description: "Webhooks, Zapier inbound, delivery log.", icon: Plug },
  { href: "/admin/system/activity", name: "Activity Log", description: "Recent admin actions across the CMS.", icon: Activity },
  { href: "/admin/system/users", name: "Users & Roles", description: "Admin accounts and role assignments.", icon: Shield },
];

export const MEDIA_TOOL: AdminNavItem = {
  href: "/admin/media",
  name: "Media Library",
  description: "Uploaded images and files from Supabase Storage.",
  icon: Image,
};

/** Legacy collection URLs → canonical /admin/content/... */
export const LEGACY_COLLECTION_SLUGS = CONTENT_COLLECTIONS.map((c) => c.slug);

export function collectionAdminPath(slug: CollectionName): string {
  return `/admin/content/${slug}`;
}
