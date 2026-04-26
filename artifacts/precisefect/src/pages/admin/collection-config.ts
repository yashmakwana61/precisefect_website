import type { CollectionName } from "@/lib/cms-api";

export type FieldType =
  | "text"
  | "textarea"
  | "longtext"
  | "number"
  | "boolean"
  | "datetime"
  | "select"
  | "metrics";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  helpText?: string;
  defaultValue?: unknown;
}

export interface CollectionConfig {
  name: string;
  singularName: string;
  description: string;
  listLabel: (item: Record<string, unknown>) => string;
  listSubLabel?: (item: Record<string, unknown>) => string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

export const collectionConfigs: Record<CollectionName, CollectionConfig> = {
  "blog-posts": {
    name: "Blog Posts",
    singularName: "Post",
    description: "Field notes, technical essays, and architectural insights.",
    listLabel: (i) => String(i.title ?? "Untitled"),
    listSubLabel: (i) => `${i.category ?? ""} \u2022 ${i.author ?? ""}`,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL Slug", type: "text", required: true, helpText: "Lowercase, hyphenated. Used in the URL." },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "author", label: "Author", type: "text", required: true },
      { key: "readTime", label: "Read Time", type: "text", required: true, helpText: "e.g. \"6 min read\"" },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { key: "body", label: "Body", type: "longtext" },
      { key: "publishedAt", label: "Publish Date", type: "datetime", required: true },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    defaults: {
      title: "",
      slug: "",
      category: "",
      author: "",
      readTime: "5 min read",
      excerpt: "",
      body: "",
      publishedAt: new Date().toISOString(),
      isPublished: true,
    },
  },
  "case-studies": {
    name: "Case Studies",
    singularName: "Case Study",
    description: "Client outcomes with metrics, problem, solution, and results.",
    listLabel: (i) => String(i.title ?? "Untitled"),
    listSubLabel: (i) => `${i.client ?? ""} \u2022 ${i.industry ?? ""}`,
    fields: [
      { key: "client", label: "Client Name", type: "text", required: true },
      { key: "industry", label: "Industry", type: "text", required: true },
      { key: "title", label: "Headline", type: "text", required: true },
      { key: "slug", label: "URL Slug", type: "text", required: true },
      { key: "problem", label: "The Entropy (Problem)", type: "longtext", required: true },
      { key: "solution", label: "The Architecture (Solution)", type: "longtext", required: true },
      { key: "results", label: "The Result", type: "longtext", required: true },
      { key: "metrics", label: "Metrics", type: "metrics", helpText: "3 key numerical outcomes." },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    defaults: {
      client: "",
      industry: "",
      title: "",
      slug: "",
      problem: "",
      solution: "",
      results: "",
      metrics: [],
      isPublished: true,
    },
  },
  faqs: {
    name: "FAQs",
    singularName: "FAQ",
    description: "Operational protocol questions answered for prospects.",
    listLabel: (i) => String(i.question ?? "Untitled"),
    listSubLabel: (i) => `Order: ${i.sortOrder ?? 0}`,
    fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
      { key: "sortOrder", label: "Sort Order", type: "number", helpText: "Lower numbers appear first." },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    defaults: { question: "", answer: "", sortOrder: 100, isPublished: true },
  },
  "team-members": {
    name: "Team Members",
    singularName: "Team Member",
    description: "The engineers, architects, and operators behind the firm.",
    listLabel: (i) => String(i.name ?? "Unnamed"),
    listSubLabel: (i) => String(i.role ?? ""),
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role / Title", type: "text", required: true },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "imageUrl", label: "Photo URL", type: "text" },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "text" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    defaults: { name: "", role: "", bio: "", imageUrl: "", linkedinUrl: "", sortOrder: 100, isPublished: true },
  },
  "job-openings": {
    name: "Job Openings",
    singularName: "Job Opening",
    description: "Open positions and engineering roles.",
    listLabel: (i) => String(i.title ?? "Untitled"),
    listSubLabel: (i) => `${i.location ?? ""} \u2022 ${i.employmentType ?? ""}`,
    fields: [
      { key: "title", label: "Job Title", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      {
        key: "employmentType",
        label: "Type",
        type: "select",
        options: ["Full-time", "Part-time", "Contract", "Internship"],
      },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "applyUrl", label: "Apply URL", type: "text", helpText: "Where the Submit Credentials button links to." },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    defaults: { title: "", location: "", employmentType: "Full-time", description: "", applyUrl: "", sortOrder: 100, isPublished: true },
  },
  testimonials: {
    name: "Testimonials",
    singularName: "Testimonial",
    description: "Quoted endorsements from clients.",
    listLabel: (i) => `"${String(i.quote ?? "").slice(0, 80)}"`,
    listSubLabel: (i) => `${i.authorName ?? ""} \u2014 ${i.authorCompany ?? ""}`,
    fields: [
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "authorName", label: "Author Name", type: "text", required: true },
      { key: "authorRole", label: "Author Role", type: "text", required: true },
      { key: "authorCompany", label: "Author Company", type: "text", required: true },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    defaults: { quote: "", authorName: "", authorRole: "", authorCompany: "", sortOrder: 100, isPublished: true },
  },
};
