import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, blogPostsTable, caseStudiesTable, customPagesTable, siteSettingsTable } from "@workspace/db";

const router: IRouter = Router();

const STATIC_PAGES = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/services", priority: "0.9", changefreq: "monthly" },
  { loc: "/services/erp", priority: "0.8", changefreq: "monthly" },
  { loc: "/services/automation", priority: "0.8", changefreq: "monthly" },
  { loc: "/industries", priority: "0.7", changefreq: "monthly" },
  { loc: "/case-studies", priority: "0.9", changefreq: "weekly" },
  { loc: "/pricing", priority: "0.8", changefreq: "monthly" },
  { loc: "/blog", priority: "0.9", changefreq: "daily" },
  { loc: "/faq", priority: "0.7", changefreq: "monthly" },
  { loc: "/careers", priority: "0.6", changefreq: "weekly" },
  { loc: "/contact", priority: "0.8", changefreq: "monthly" },
];

router.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const settingsRows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "siteUrl"));
    const siteUrl = settingsRows[0]?.value || "https://precisefect.com";

    const [posts, studies, customPages] = await Promise.all([
      db.select({ slug: blogPostsTable.slug, updatedAt: blogPostsTable.updatedAt })
        .from(blogPostsTable).where(eq(blogPostsTable.isPublished, true)),
      db.select({ slug: caseStudiesTable.slug, updatedAt: caseStudiesTable.updatedAt })
        .from(caseStudiesTable).where(eq(caseStudiesTable.isPublished, true)),
      db.select({ slug: customPagesTable.slug, updatedAt: customPagesTable.updatedAt })
        .from(customPagesTable).where(eq(customPagesTable.isPublished, true)),
    ]);

    const now = new Date().toISOString();

    const urls = [
      ...STATIC_PAGES.map(p => `  <url>\n    <loc>${siteUrl}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n    <lastmod>${now}</lastmod>\n  </url>`),
      ...posts.map(p => `  <url>\n    <loc>${siteUrl}/blog/${p.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n    <lastmod>${p.updatedAt.toISOString()}</lastmod>\n  </url>`),
      ...studies.map(s => `  <url>\n    <loc>${siteUrl}/case-studies/${s.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <lastmod>${s.updatedAt.toISOString()}</lastmod>\n  </url>`),
      ...customPages.map(p => `  <url>\n    <loc>${siteUrl}/p/${p.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n    <lastmod>${p.updatedAt.toISOString()}</lastmod>\n  </url>`),
    ];

    res.set("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`);
  } catch (err) {
    req.log.error({ err }, "sitemap failed");
    res.status(500).send("Internal error");
  }
});

router.get("/robots.txt", async (req: Request, res: Response) => {
  try {
    const settingsRows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "siteUrl"));
    const siteUrl = settingsRows[0]?.value || "https://precisefect.com";
    res.set("Content-Type", "text/plain");
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/api/sitemap.xml\n`);
  } catch (err) {
    req.log.error({ err }, "robots.txt failed");
    res.status(500).send("Internal error");
  }
});

export default router;
