export type SitePageDefaults = {
  path: string;
  title: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  bodyContent: string;
  metaTitle: string;
  metaDescription: string;
};

export const SITE_PAGE_REGISTRY: SitePageDefaults[] = [
  {
    path: "/",
    title: "Homepage",
    heroEyebrow: "Precision Meets Perfection",
    heroHeadline: "Architect operational perfection.",
    heroSubheadline: "We build resilient ERP and automation systems for enterprises that require scale without structural entropy.",
    bodyContent: "",
    metaTitle: "Precisefect | ERP Architecture & Business Automation",
    metaDescription: "Precisefect architects perfect operational systems for scaling enterprises.",
  },
  {
    path: "/about",
    title: "About",
    heroEyebrow: "Firm Profile",
    heroHeadline: "We engineer scale.",
    heroSubheadline: "Precisefect was born from a simple observation: great businesses are often bottlenecked by terrible systems. We exist to remove those bottlenecks through precision engineering and perfect execution.",
    bodyContent: "",
    metaTitle: "About Us | Precisefect",
    metaDescription: "Learn about Precisefect's mission to architect perfect operational systems for scaling enterprises.",
  },
  {
    path: "/services",
    title: "Services",
    heroEyebrow: "Capabilities",
    heroHeadline: "Full-stack operational architecture.",
    heroSubheadline: "From ERP selection to custom automation—we engineer systems that eliminate entropy at scale.",
    bodyContent: "",
    metaTitle: "Services | Precisefect",
    metaDescription: "ERP architecture, operational automation, and custom integration services.",
  },
  {
    path: "/services/erp",
    title: "Services — ERP",
    heroEyebrow: "ERP Architecture",
    heroHeadline: "Enterprise resource planning, engineered.",
    heroSubheadline: "We architect ERP implementations that survive growth—not just go-live.",
    bodyContent: "",
    metaTitle: "ERP Architecture | Precisefect",
    metaDescription: "Precision ERP implementation and architecture for scaling enterprises.",
  },
  {
    path: "/services/automation",
    title: "Services — Automation",
    heroEyebrow: "Operational Automation",
    heroHeadline: "Automate the repeatable. Perfect the exceptional.",
    heroSubheadline: "Custom workflows and integrations that remove manual entropy from your operations.",
    bodyContent: "",
    metaTitle: "Operational Automation | Precisefect",
    metaDescription: "Business process automation and custom integration engineering.",
  },
  {
    path: "/industries",
    title: "Industries",
    heroEyebrow: "Vertical Expertise",
    heroHeadline: "Systems built for your domain.",
    heroSubheadline: "We bring deep operational knowledge across manufacturing, distribution, and professional services.",
    bodyContent: "",
    metaTitle: "Industries | Precisefect",
    metaDescription: "ERP and automation expertise across key industry verticals.",
  },
  {
    path: "/case-studies",
    title: "Case Studies",
    heroEyebrow: "The Proof",
    heroHeadline: "Structural outcomes.",
    heroSubheadline: "Real transformations from enterprises that required precision at scale.",
    bodyContent: "",
    metaTitle: "Case Studies | Precisefect",
    metaDescription: "Client outcomes with metrics, problem, solution, and results.",
  },
  {
    path: "/pricing",
    title: "Pricing",
    heroEyebrow: "Engagement Models",
    heroHeadline: "Transparent architecture.",
    heroSubheadline: "Structured engagement tiers designed for enterprises at every stage of operational maturity.",
    bodyContent: "",
    metaTitle: "Pricing | Precisefect",
    metaDescription: "Engagement models and pricing for ERP and automation services.",
  },
  {
    path: "/blog",
    title: "Blog",
    heroEyebrow: "Field Notes",
    heroHeadline: "Architectural Insights.",
    heroSubheadline: "Technical essays, architectural tear-downs, and operational strategy from the engineers at Precisefect.",
    bodyContent: "",
    metaTitle: "Field Notes & Insights | Precisefect",
    metaDescription: "Technical and strategic insights on ERP implementation, business automation, and scaling operations.",
  },
  {
    path: "/faq",
    title: "FAQ",
    heroEyebrow: "Operational Protocol",
    heroHeadline: "Common inquiries.",
    heroSubheadline: "Answers to the structural and procedural questions we hear from enterprise prospects.",
    bodyContent: "",
    metaTitle: "FAQ | Precisefect",
    metaDescription: "Frequently asked questions about Precisefect engagements and methodology.",
  },
  {
    path: "/careers",
    title: "Careers",
    heroEyebrow: "Join The Firm",
    heroHeadline: "Build systems that matter.",
    heroSubheadline: "We're hiring engineers, architects, and operators who obsess over operational perfection.",
    bodyContent: "",
    metaTitle: "Careers | Precisefect",
    metaDescription: "Open engineering and consulting roles at Precisefect.",
  },
  {
    path: "/contact",
    title: "Contact",
    heroEyebrow: "Begin The Dialogue",
    heroHeadline: "Submit RFP.",
    heroSubheadline: "Detail your current structural bottlenecks. Our principal architects review every technical inquiry directly.",
    bodyContent: "",
    metaTitle: "Submit RFP | Precisefect Consulting",
    metaDescription: "Schedule an architectural review with Precisefect to discuss your ERP implementation or business automation needs.",
  },
];

export function getSitePageDefaults(path: string): SitePageDefaults | undefined {
  return SITE_PAGE_REGISTRY.find((p) => p.path === path);
}

export function normalizePagePath(path: string): string {
  if (!path) return "/";
  const trimmed = path.trim();
  if (trimmed === "/") return "/";
  return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") || "/" : `/${trimmed.replace(/\/+$/, "")}`;
}
