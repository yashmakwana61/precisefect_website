/** Canonical entity type keys for revisions, activity, and asset links. */
export const ENTITY_TYPES = [
  "blog-posts",
  "case-studies",
  "faqs",
  "team-members",
  "job-openings",
  "testimonials",
  "custom-pages",
  "site-pages",
  "site-blocks",
  "seo-pages",
  "assets",
  "leads",
  "lead-notes",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const SITE_BLOCK_ENTITY_PREFIX = "site-block:" as const;
