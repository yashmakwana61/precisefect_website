import { Router, type IRouter, type Request, type Response } from "express";
import { eq, and, lte, sql, inArray } from "drizzle-orm";
import { db, siteBlocksTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authMiddleware";
import { recordRevision } from "../lib/revisions";

const router: IRouter = Router();

const DEFAULT_NAVBAR = {
  links: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
  ],
  ctaLabel: "Consultation",
  ctaHref: "/contact",
};

const DEFAULT_FOOTER = {
  tagline:
    "Architecting operational perfection. We build resilient, automated systems for enterprises that require scale without structural entropy.",
  columns: [
    {
      title: "Services",
      links: [
        { label: "ERP Architecture", href: "/services/erp" },
        { label: "Operational Automation", href: "/services/automation" },
        { label: "Custom Integration", href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Firm", href: "/about" },
        { label: "The Proof", href: "/case-studies" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Contact",
      items: [
        { label: "hello@precisefect.com", href: "mailto:hello@precisefect.com" },
        { label: "San Francisco · Bangalore", href: "" },
        { label: "Submit RFP →", href: "/contact" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyright: "Precisefect Consulting. Proprietary & Confidential.",
};

async function ensureDefaults(): Promise<void> {
  const defaults: Array<{ blockType: string; content: Record<string, unknown> }> = [
    { blockType: "navbar", content: DEFAULT_NAVBAR },
    { blockType: "footer", content: DEFAULT_FOOTER },
  ];
  for (const d of defaults) {
    const [existing] = await db
      .select()
      .from(siteBlocksTable)
      .where(eq(siteBlocksTable.blockType, d.blockType))
      .limit(1);
    if (!existing) {
      await db.insert(siteBlocksTable).values({
        blockType: d.blockType,
        content: d.content,
        isPublished: true,
      });
    }
  }
}

router.get("/site-blocks", async (req: Request, res: Response) => {
  const typesParam = String(req.query.types ?? "navbar,footer");
  const types = typesParam.split(",").map((t) => t.trim()).filter(Boolean);
  const isAdminView = req.isAdmin && (req.query.scope === "admin" || req.query.preview === "1");

  try {
    await ensureDefaults();
    const query = db.select().from(siteBlocksTable).$dynamic();
    if (types.length > 0) {
      query.where(inArray(siteBlocksTable.blockType, types));
    }
    let rows = await query;
    if (!isAdminView) {
      rows = rows.filter(
        (r) =>
          r.isPublished &&
          new Date(r.publishedAt).getTime() <= Date.now(),
      );
    }
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "site-blocks list failed");
    res.status(500).json({ error: "Internal error" });
  }
});

router.put("/site-blocks/:type", requireAdmin, async (req: Request, res: Response) => {
  const blockType = String(req.params.type);
  const { content, isPublished, publishedAt } = req.body as {
    content?: Record<string, unknown>;
    isPublished?: boolean;
    publishedAt?: string;
  };
  if (!content || typeof content !== "object") {
    res.status(400).json({ error: "content required" });
    return;
  }
  try {
    await ensureDefaults();
    const [row] = await db
      .insert(siteBlocksTable)
      .values({
        blockType,
        content,
        isPublished: isPublished ?? true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteBlocksTable.blockType,
        set: {
          content,
          isPublished: isPublished ?? true,
          publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    await recordRevision(
      `site-block:${blockType}`,
      row.id,
      row as unknown as Record<string, unknown>,
      "update",
    );
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "site-blocks upsert failed");
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
