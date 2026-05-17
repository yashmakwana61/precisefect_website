import { logger } from "../../lib/logger";
import { signWebhookPayload } from "../../lib/secrets";
import { assertSafeOutboundUrl } from "../../lib/url-safety";
import { logDelivery } from "./delivery.service";

const MAX_ATTEMPTS = 3;

function backoffMs(attempt: number): number {
  return Math.min(60_000, 1000 * 2 ** attempt);
}

export async function deliverOutboundWebhook(input: {
  connectionId: number;
  url: string;
  signingSecret?: string | null;
  eventType: string;
  payload: Record<string, unknown>;
}): Promise<{ ok: boolean; httpStatus?: number; error?: string }> {
  try {
    await assertSafeOutboundUrl(input.url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unsafe webhook URL";
    return { ok: false, error: message };
  }

  const body = JSON.stringify({
    event: input.eventType,
    timestamp: new Date().toISOString(),
    data: input.payload,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Precisefect-Integrations/1.0",
  };
  if (input.signingSecret) {
    headers["X-PSF-Signature"] = `sha256=${signWebhookPayload(body, input.signingSecret)}`;
  }

  let lastError = "";
  let lastStatus: number | undefined;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, backoffMs(attempt)));
    }
    try {
      const res = await fetch(input.url, { method: "POST", headers, body });
      lastStatus = res.status;
      if (res.ok) {
        await logDelivery({
          connectionId: input.connectionId > 0 ? input.connectionId : null,
          direction: "outbound",
          eventType: input.eventType,
          payload: input.payload,
          status: "success",
          httpStatus: res.status,
          attempts: attempt + 1,
        });
        return { ok: true, httpStatus: res.status };
      }
      lastError = await res.text().catch(() => res.statusText);
      logger.warn({ status: res.status, url: input.url }, "webhook non-2xx");
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      logger.error({ err, url: input.url }, "webhook request failed");
    }
  }

  await logDelivery({
    connectionId: input.connectionId > 0 ? input.connectionId : null,
    direction: "outbound",
    eventType: input.eventType,
    payload: input.payload,
    status: "failed",
    httpStatus: lastStatus ?? null,
    error: lastError.slice(0, 500),
    attempts: MAX_ATTEMPTS,
  });

  return { ok: false, httpStatus: lastStatus, error: lastError };
}
