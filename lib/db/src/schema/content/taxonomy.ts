import { pgTable, text, serial, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const taxonomyTermsTable = pgTable(
  "taxonomy_terms",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").notNull(),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
  },
  (t) => [uniqueIndex("taxonomy_kind_slug_idx").on(t.kind, t.slug)],
);

export const contentTaxonomyTable = pgTable(
  "content_taxonomy",
  {
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    termId: integer("term_id")
      .notNull()
      .references(() => taxonomyTermsTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.entityType, t.entityId, t.termId] })],
);

export const insertTaxonomyTermSchema = createInsertSchema(taxonomyTermsTable).omit({ id: true });
export const selectTaxonomyTermSchema = createSelectSchema(taxonomyTermsTable);
export type InsertTaxonomyTerm = z.infer<typeof insertTaxonomyTermSchema>;
export type TaxonomyTerm = typeof taxonomyTermsTable.$inferSelect;
