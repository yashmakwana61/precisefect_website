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
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import type { Request, Response } from "express";

const router: IRouter = Router();

router.use("/blog-posts", createCrudRouter({
  table: blogPostsTable as never,
  insertSchema: insertBlogPostSchema,
  publicFilter: { column: blogPostsTable.isPublished, value: true },
  orderBy: { column: blogPostsTable.publishedAt, direction: "desc" },
}));

router.use("/case-studies", createCrudRouter({
  table: caseStudiesTable as never,
  insertSchema: insertCaseStudySchema,
  publicFilter: { column: caseStudiesTable.isPublished, value: true },
  orderBy: { column: caseStudiesTable.sortOrder, direction: "asc" },
}));

router.use("/faqs", createCrudRouter({
  table: faqsTable as never,
  insertSchema: insertFaqSchema,
  publicFilter: { column: faqsTable.isPublished, value: true },
  orderBy: { column: faqsTable.sortOrder, direction: "asc" },
}));

router.use("/team-members", createCrudRouter({
  table: teamMembersTable as never,
  insertSchema: insertTeamMemberSchema,
  publicFilter: { column: teamMembersTable.isPublished, value: true },
  orderBy: { column: teamMembersTable.sortOrder, direction: "asc" },
}));

router.use("/job-openings", createCrudRouter({
  table: jobOpeningsTable as never,
  insertSchema: insertJobOpeningSchema,
  publicFilter: { column: jobOpeningsTable.isPublished, value: true },
  orderBy: { column: jobOpeningsTable.sortOrder, direction: "asc" },
}));

router.use("/testimonials", createCrudRouter({
  table: testimonialsTable as never,
  insertSchema: insertTestimonialSchema,
  publicFilter: { column: testimonialsTable.isPublished, value: true },
  orderBy: { column: testimonialsTable.sortOrder, direction: "asc" },
}));

router.use("/custom-pages", createCrudRouter({
  table: customPagesTable as never,
  insertSchema: insertCustomPageSchema,
  publicFilter: { column: customPagesTable.isPublished, value: true },
  orderBy: { column: customPagesTable.sortOrder, direction: "asc" },
}));

// Public: get a custom page by slug
router.get("/custom-pages/by-slug/:slug", async (req: Request, res: Response) => {
  try {
    const [row] = await db.select().from(customPagesTable)
      .where(eq(customPagesTable.slug, req.params.slug)).limit(1);
    if (!row || (!row.isPublished && !req.isAdmin)) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "custom-page by-slug failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
