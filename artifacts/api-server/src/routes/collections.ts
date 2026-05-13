import { Router, type IRouter } from "express";
import {
  blogPostsTable, insertBlogPostSchema,
  caseStudiesTable, insertCaseStudySchema,
  faqsTable, insertFaqSchema,
  teamMembersTable, insertTeamMemberSchema,
  jobOpeningsTable, insertJobOpeningSchema,
  testimonialsTable, insertTestimonialSchema,
  customPagesTable, insertCustomPageSchema,
} from "@workspace/db";
import { createCrudRouter } from "../lib/crud";
import { eq, and, lte, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.use("/blog-posts", createCrudRouter({
  table: blogPostsTable as never,
  insertSchema: insertBlogPostSchema as never,
  entityType: "blog-posts",
  publicFilter: { column: blogPostsTable.isPublished, value: true },
  scheduleColumn: blogPostsTable.publishedAt,
  orderBy: { column: blogPostsTable.publishedAt, direction: "desc" },
}));

router.use("/case-studies", createCrudRouter({
  table: caseStudiesTable as never,
  insertSchema: insertCaseStudySchema as never,
  entityType: "case-studies",
  publicFilter: { column: caseStudiesTable.isPublished, value: true },
  scheduleColumn: caseStudiesTable.publishedAt,
  orderBy: { column: caseStudiesTable.sortOrder, direction: "asc" },
}));

router.use("/faqs", createCrudRouter({
  table: faqsTable as never,
  insertSchema: insertFaqSchema as never,
  entityType: "faqs",
  publicFilter: { column: faqsTable.isPublished, value: true },
  scheduleColumn: faqsTable.publishedAt,
  orderBy: { column: faqsTable.sortOrder, direction: "asc" },
}));

router.use("/team-members", createCrudRouter({
  table: teamMembersTable as never,
  insertSchema: insertTeamMemberSchema as never,
  entityType: "team-members",
  publicFilter: { column: teamMembersTable.isPublished, value: true },
  scheduleColumn: teamMembersTable.publishedAt,
  orderBy: { column: teamMembersTable.sortOrder, direction: "asc" },
}));

router.use("/job-openings", createCrudRouter({
  table: jobOpeningsTable as never,
  insertSchema: insertJobOpeningSchema as never,
  entityType: "job-openings",
  publicFilter: { column: jobOpeningsTable.isPublished, value: true },
  scheduleColumn: jobOpeningsTable.publishedAt,
  orderBy: { column: jobOpeningsTable.sortOrder, direction: "asc" },
}));

router.use("/testimonials", createCrudRouter({
  table: testimonialsTable as never,
  insertSchema: insertTestimonialSchema as never,
  entityType: "testimonials",
  publicFilter: { column: testimonialsTable.isPublished, value: true },
  scheduleColumn: testimonialsTable.publishedAt,
  orderBy: { column: testimonialsTable.sortOrder, direction: "asc" },
}));

router.use("/custom-pages", createCrudRouter({
  table: customPagesTable as never,
  insertSchema: insertCustomPageSchema as never,
  entityType: "custom-pages",
  publicFilter: { column: customPagesTable.isPublished, value: true },
  scheduleColumn: customPagesTable.publishedAt,
  orderBy: { column: customPagesTable.sortOrder, direction: "asc" },
}));

router.get("/custom-pages/by-slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const isAdminView = req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");
    const conditions = [eq(customPagesTable.slug, slug)];
    if (!isAdminView) {
      conditions.push(eq(customPagesTable.isPublished, true));
      conditions.push(lte(customPagesTable.publishedAt, sql`now()`));
    }
    const [row] = await db
      .select()
      .from(customPagesTable)
      .where(and(...conditions))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "custom-page by-slug failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/blog-posts/by-slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const isAdminView = req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");
    const conditions = [eq(blogPostsTable.slug, slug)];
    if (!isAdminView) {
      conditions.push(eq(blogPostsTable.isPublished, true));
      conditions.push(lte(blogPostsTable.publishedAt, sql`now()`));
    }
    const [row] = await db
      .select()
      .from(blogPostsTable)
      .where(and(...conditions))
      .limit(1);
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "blog-post by-slug failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
