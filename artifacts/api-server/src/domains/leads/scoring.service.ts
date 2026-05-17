import { eq } from "drizzle-orm";
import { db, leadsTable, type Lead } from "@workspace/db";

type ScoringInput = Pick<
  Lead,
  "id" | "source" | "phone" | "businessType" | "company" | "message" | "email"
>;

const RULES: Array<{
  key: string;
  points: number;
  match: (l: ScoringInput) => boolean;
}> = [
  { key: "source_referral", points: 15, match: (l) => l.source === "referral" },
  { key: "source_whatsapp", points: 8, match: (l) => l.source === "whatsapp" },
  { key: "has_phone", points: 10, match: (l) => l.phone.trim().length >= 10 },
  { key: "has_company", points: 5, match: (l) => l.company.trim().length > 0 },
  {
    key: "detailed_message",
    points: 5,
    match: (l) => l.message.trim().length >= 120,
  },
  {
    key: "business_manufacturing",
    points: 5,
    match: (l) => /manufactur/i.test(l.businessType),
  },
];

export function computeLeadScore(lead: ScoringInput): {
  score: number;
  scoreBreakdown: Record<string, number>;
} {
  const scoreBreakdown: Record<string, number> = {};
  let score = 0;
  for (const rule of RULES) {
    if (rule.match(lead)) {
      scoreBreakdown[rule.key] = rule.points;
      score += rule.points;
    }
  }
  return { score, scoreBreakdown };
}

export async function applyLeadScore(leadId: number): Promise<void> {
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, leadId)).limit(1);
  if (!lead) return;
  const { score, scoreBreakdown } = computeLeadScore(lead);
  await db
    .update(leadsTable)
    .set({ score, scoreBreakdown, updatedAt: new Date() })
    .where(eq(leadsTable.id, leadId));
}
