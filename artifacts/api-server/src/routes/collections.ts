import { Router, type IRouter } from "express";
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
} from "@workspace/db";
import { createCrudRouter } from "../lib/crud";

const router: IRouter = Router();

router.use(
  "/blog-posts",
  createCrudRouter({
    table: blogPostsTable as never,
    insertSchema: insertBlogPostSchema,
    publicFilter: { column: blogPostsTable.isPublished, value: true },
    orderBy: { column: blogPostsTable.publishedAt, direction: "desc" },
  }),
);

router.use(
  "/case-studies",
  createCrudRouter({
    table: caseStudiesTable as never,
    insertSchema: insertCaseStudySchema,
    publicFilter: { column: caseStudiesTable.isPublished, value: true },
    orderBy: { column: caseStudiesTable.sortOrder, direction: "asc" },
  }),
);

router.use(
  "/faqs",
  createCrudRouter({
    table: faqsTable as never,
    insertSchema: insertFaqSchema,
    publicFilter: { column: faqsTable.isPublished, value: true },
    orderBy: { column: faqsTable.sortOrder, direction: "asc" },
  }),
);

router.use(
  "/team-members",
  createCrudRouter({
    table: teamMembersTable as never,
    insertSchema: insertTeamMemberSchema,
    publicFilter: { column: teamMembersTable.isPublished, value: true },
    orderBy: { column: teamMembersTable.sortOrder, direction: "asc" },
  }),
);

router.use(
  "/job-openings",
  createCrudRouter({
    table: jobOpeningsTable as never,
    insertSchema: insertJobOpeningSchema,
    publicFilter: { column: jobOpeningsTable.isPublished, value: true },
    orderBy: { column: jobOpeningsTable.sortOrder, direction: "asc" },
  }),
);

router.use(
  "/testimonials",
  createCrudRouter({
    table: testimonialsTable as never,
    insertSchema: insertTestimonialSchema,
    publicFilter: { column: testimonialsTable.isPublished, value: true },
    orderBy: { column: testimonialsTable.sortOrder, direction: "asc" },
  }),
);

export default router;
