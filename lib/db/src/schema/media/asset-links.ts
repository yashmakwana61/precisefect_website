import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { assetsTable } from "../assets";

export const assetLinksTable = pgTable(
  "asset_links",
  {
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    assetId: integer("asset_id")
      .notNull()
      .references(() => assetsTable.id, { onDelete: "cascade" }),
    fieldKey: text("field_key").notNull().default("default"),
  },
  (t) => [primaryKey({ columns: [t.entityType, t.entityId, t.fieldKey] })],
);
