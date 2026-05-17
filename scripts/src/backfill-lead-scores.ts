import { eq } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";

function computeScore(lead: typeof leadsTable.$inferSelect) {
  const breakdown: Record<string, number> = {};
  let score = 0;
  const add = (key: string, points: number, ok: boolean) => {
    if (ok) {
      breakdown[key] = points;
      score += points;
    }
  };
  add("source_referral", 15, lead.source === "referral");
  add("source_whatsapp", 8, lead.source === "whatsapp");
  add("has_phone", 10, lead.phone.trim().length >= 10);
  add("has_company", 5, lead.company.trim().length > 0);
  add("detailed_message", 5, lead.message.trim().length >= 120);
  add("business_manufacturing", 5, /manufactur/i.test(lead.businessType));
  return { score, scoreBreakdown: breakdown };
}

async function main() {
  const leads = await db.select().from(leadsTable);
  for (const lead of leads) {
    const { score, scoreBreakdown } = computeScore(lead);
    await db
      .update(leadsTable)
      .set({ score, scoreBreakdown, updatedAt: new Date() })
      .where(eq(leadsTable.id, lead.id));
  }
  console.log(`Updated scores for ${leads.length} leads.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
