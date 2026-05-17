import type { Lead } from "@workspace/db";
import { logger } from "../../lib/logger";

export async function sendNewLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_NOTIFY_FROM ?? "Precisefect <onboarding@resend.dev>";

  if (!apiKey || !to) {
    logger.debug("Lead email skipped (RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set)");
    return;
  }

  const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";
  const adminLink = `${siteUrl.replace(/\/$/, "")}/admin/leads/${lead.id}`;

  const html = `
    <h2>New lead: ${escapeHtml(lead.name)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
    <p><strong>Industry:</strong> ${escapeHtml(lead.businessType)}</p>
    <p><strong>Source:</strong> ${escapeHtml(lead.source)} ${escapeHtml(lead.sourceDetail)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>
    <p><a href="${adminLink}">View in admin</a></p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New lead: ${lead.name} (${lead.businessType})`,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      logger.error({ status: res.status, body: text }, "Resend API failed");
    }
  } catch (err) {
    logger.error({ err }, "sendNewLeadEmail failed");
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
