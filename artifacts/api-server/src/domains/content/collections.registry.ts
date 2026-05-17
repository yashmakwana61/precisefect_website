import {
  blogPostsTable,
  insertBlogPostSchema,
  caseStudiesTable,
  insertCaseStudySchema,
  faqsTable,
  insertFaqSchema,
  teamMembersTable,
  insertTeamMemberSchema,
  jobOpeningsTable,
  insertJobOpeningSchema,
  testimonialsTable,
  insertTestimonialSchema,
  customPagesTable,
  insertCustomPageSchema,
} from "@workspace/db";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

type ParseResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; error: { issues: unknown } };

export type InsertSchema = {
  safeParse: (data: unknown) => ParseResult;
  partial?: () => InsertSchema;
};

export type CollectionDefinition = {
  table: PgTable & Record<string, PgColumn>;
  insertSchema: InsertSchema;
  entityType: string;
  publicFilter?: { column: PgColumn; value: unknown };
  scheduleColumn?: PgColumn;
  orderBy?: { column: PgColumn; direction?: "asc" | "desc" };
  /** When true, sets created_by_id / updated_by_id on write (blog-posts). */
  trackActor?: boolean;
};

export const COLLECTION_REGISTRY = {
  "blog-posts": {
    table: blogPostsTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertBlogPostSchema as InsertSchema,
    entityType: "blog-posts",
    trackActor: true,
    publicFilter: { column: blogPostsTable.isPublished, value: true },
    scheduleColumn: blogPostsTable.publishedAt,
    orderBy: { column: blogPostsTable.publishedAt, direction: "desc" },
  },
  "case-studies": {
    table: caseStudiesTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertCaseStudySchema as InsertSchema,
    entityType: "case-studies",
    publicFilter: { column: caseStudiesTable.isPublished, value: true },
    scheduleColumn: caseStudiesTable.publishedAt,
    orderBy: { column: caseStudiesTable.sortOrder, direction: "asc" },
  },
  faqs: {
    table: faqsTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertFaqSchema as InsertSchema,
    entityType: "faqs",
    publicFilter: { column: faqsTable.isPublished, value: true },
    scheduleColumn: faqsTable.publishedAt,
    orderBy: { column: faqsTable.sortOrder, direction: "asc" },
  },
  "team-members": {
    table: teamMembersTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertTeamMemberSchema as InsertSchema,
    entityType: "team-members",
    publicFilter: { column: teamMembersTable.isPublished, value: true },
    scheduleColumn: teamMembersTable.publishedAt,
    orderBy: { column: teamMembersTable.sortOrder, direction: "asc" },
  },
  "job-openings": {
    table: jobOpeningsTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertJobOpeningSchema as InsertSchema,
    entityType: "job-openings",
    publicFilter: { column: jobOpeningsTable.isPublished, value: true },
    scheduleColumn: jobOpeningsTable.publishedAt,
    orderBy: { column: jobOpeningsTable.sortOrder, direction: "asc" },
  },
  testimonials: {
    table: testimonialsTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertTestimonialSchema as InsertSchema,
    entityType: "testimonials",
    publicFilter: { column: testimonialsTable.isPublished, value: true },
    scheduleColumn: testimonialsTable.publishedAt,
    orderBy: { column: testimonialsTable.sortOrder, direction: "asc" },
  },
  "custom-pages": {
    table: customPagesTable as unknown as PgTable & Record<string, PgColumn>,
    insertSchema: insertCustomPageSchema as InsertSchema,
    entityType: "custom-pages",
    publicFilter: { column: customPagesTable.isPublished, value: true },
    scheduleColumn: customPagesTable.publishedAt,
    orderBy: { column: customPagesTable.sortOrder, direction: "asc" },
  },
} as const satisfies Record<string, CollectionDefinition>;

export type CollectionSlug = keyof typeof COLLECTION_REGISTRY;
