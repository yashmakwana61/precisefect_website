import { z } from "zod";
import type { IntegrationConnection } from "@workspace/db";
import * as leadsService from "../leads/leads.service";
import { logDelivery } from "./delivery.service";

const inboundLeadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  businessType: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default("Inbound integration lead"),
  company: z.string().trim().optional(),
  sourceDetail: z.string().trim().optional(),
});

export async function handleInboundLead(
  connection: IntegrationConnection,
  body: unknown,
  meta: { userAgent?: string },
): Promise<{ ok: true; leadId: number } | { ok: false; error: string }> {
  const parsed = inboundLeadSchema.safeParse(body);
  if (!parsed.success) {
    await logDelivery({
      connectionId: connection.id,
      direction: "inbound",
      eventType: "lead.create",
      payload: { body },
      status: "failed",
      error: "Invalid payload",
    });
    return { ok: false, error: "Invalid payload" };
  }

  try {
    const lead = await leadsService.createLead(
      {
        ...parsed.data,
        source: "other",
        sourceDetail: parsed.data.sourceDetail ?? `integration:${connection.label}`,
      },
      { userAgent: meta.userAgent ?? "integration-inbound" },
    );

    await logDelivery({
      connectionId: connection.id,
      direction: "inbound",
      eventType: "lead.create",
      payload: { leadId: lead.id, email: lead.email },
      status: "success",
    });

    return { ok: true, leadId: lead.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logDelivery({
      connectionId: connection.id,
      direction: "inbound",
      eventType: "lead.create",
      payload: { body },
      status: "failed",
      error: message,
    });
    return { ok: false, error: message };
  }
}
