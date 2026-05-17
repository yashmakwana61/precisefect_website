import { desc, eq } from "drizzle-orm";
import { db, integrationConnectionsTable, type IntegrationConnection } from "@workspace/db";
import { decryptSecret, encryptSecret, generateInboundToken } from "../../lib/secrets";
import { deliverOutboundWebhook } from "./webhook.service";

export const INTEGRATION_PROVIDERS = ["webhook", "zapier", "resend"] as const;
export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export type ConnectionPublic = Omit<IntegrationConnection, "secretsEnc"> & {
  hasSecrets: boolean;
  webhookUrl?: string;
};

function toPublic(row: IntegrationConnection): ConnectionPublic {
  const { secretsEnc, ...rest } = row;
  const config = rest.config ?? {};
  const base: ConnectionPublic = {
    ...rest,
    hasSecrets: Boolean(secretsEnc),
  };
  if (row.provider === "zapier") {
    const apiBase =
      process.env.API_PUBLIC_URL ??
      `http://localhost:${process.env.PORT ?? 8080}`;
    base.webhookUrl = `${apiBase.replace(/\/$/, "")}/api/integrations/inbound/${row.inboundToken ?? ""}`;
  }
  if (row.provider === "webhook" && typeof config.url === "string") {
    base.webhookUrl = config.url;
  }
  return base;
}

export function getConnectionSecrets(row: IntegrationConnection): Record<string, string> {
  const raw = decryptSecret(row.secretsEnc);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function listConnections(): Promise<ConnectionPublic[]> {
  const rows = await db
    .select()
    .from(integrationConnectionsTable)
    .orderBy(desc(integrationConnectionsTable.id));
  return rows.map(toPublic);
}

export async function getConnection(id: number): Promise<ConnectionPublic | null> {
  const [row] = await db
    .select()
    .from(integrationConnectionsTable)
    .where(eq(integrationConnectionsTable.id, id))
    .limit(1);
  return row ? toPublic(row) : null;
}

export async function getConnectionRaw(id: number): Promise<IntegrationConnection | null> {
  const [row] = await db
    .select()
    .from(integrationConnectionsTable)
    .where(eq(integrationConnectionsTable.id, id))
    .limit(1);
  return row ?? null;
}

export async function findByInboundToken(token: string): Promise<IntegrationConnection | null> {
  const [row] = await db
    .select()
    .from(integrationConnectionsTable)
    .where(eq(integrationConnectionsTable.inboundToken, token))
    .limit(1);
  return row ?? null;
}

export async function createConnection(input: {
  provider: string;
  label: string;
  isEnabled?: boolean;
  config?: Record<string, unknown>;
  secrets?: Record<string, string>;
  createdById?: number | null;
}): Promise<ConnectionPublic> {
  const provider = input.provider === "zapier" ? "zapier" : input.provider;
  const needsInbound = provider === "zapier";
  const secretsEnc =
    input.secrets && Object.keys(input.secrets).length > 0
      ? encryptSecret(JSON.stringify(input.secrets))
      : null;

  const [row] = await db
    .insert(integrationConnectionsTable)
    .values({
      provider,
      label: input.label,
      isEnabled: input.isEnabled ?? true,
      config: input.config ?? {},
      secretsEnc,
      inboundToken: needsInbound ? generateInboundToken() : null,
      createdById: input.createdById ?? null,
      updatedAt: new Date(),
    })
    .returning();

  return toPublic(row);
}

export async function updateConnection(
  id: number,
  input: Partial<{
    label: string;
    isEnabled: boolean;
    config: Record<string, unknown>;
    secrets: Record<string, string>;
  }>,
): Promise<ConnectionPublic | null> {
  const patch: Partial<typeof integrationConnectionsTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.label != null) patch.label = input.label;
  if (input.isEnabled != null) patch.isEnabled = input.isEnabled;
  if (input.config != null) patch.config = input.config;
  if (input.secrets != null && Object.keys(input.secrets).length > 0) {
    patch.secretsEnc = encryptSecret(JSON.stringify(input.secrets));
  }

  const [row] = await db
    .update(integrationConnectionsTable)
    .set(patch)
    .where(eq(integrationConnectionsTable.id, id))
    .returning();

  return row ? toPublic(row) : null;
}

export async function deleteConnection(id: number): Promise<boolean> {
  const deleted = await db
    .delete(integrationConnectionsTable)
    .where(eq(integrationConnectionsTable.id, id))
    .returning({ id: integrationConnectionsTable.id });
  return deleted.length > 0;
}

export async function testConnection(id: number): Promise<{ ok: boolean; message: string }> {
  const row = await getConnectionRaw(id);
  if (!row) return { ok: false, message: "Not found" };
  if (!row.isEnabled) return { ok: false, message: "Connection is disabled" };

  if (row.provider === "webhook") {
    const url = String(row.config?.url ?? "");
    if (!url) return { ok: false, message: "Missing webhook URL in config" };
    const secrets = getConnectionSecrets(row);
    const result = await deliverOutboundWebhook({
      connectionId: row.id,
      url,
      signingSecret: secrets.signingSecret ?? null,
      eventType: "integration.test",
      payload: { ping: true },
    });
    return result.ok
      ? { ok: true, message: `Delivered (${result.httpStatus})` }
      : { ok: false, message: result.error ?? "Delivery failed" };
  }

  if (row.provider === "resend") {
    const hasEnv = Boolean(process.env.RESEND_API_KEY);
    return hasEnv
      ? { ok: true, message: "RESEND_API_KEY is configured in environment" }
      : { ok: false, message: "RESEND_API_KEY not set" };
  }

  if (row.provider === "zapier") {
    return row.inboundToken
      ? { ok: true, message: "Inbound URL is ready for Zapier/Make triggers" }
      : { ok: false, message: "Missing inbound token" };
  }

  return { ok: false, message: "Unknown provider" };
}

export async function sendViaConnection(
  connectionId: number,
  eventType: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  const row = await getConnectionRaw(connectionId);
  if (!row?.isEnabled) return { ok: false, error: "Connection disabled or missing" };

  if (row.provider === "webhook") {
    const url = String(row.config?.url ?? "");
    if (!url) return { ok: false, error: "No URL configured" };
    const secrets = getConnectionSecrets(row);
    const result = await deliverOutboundWebhook({
      connectionId: row.id,
      url,
      signingSecret: secrets.signingSecret ?? null,
      eventType,
      payload,
    });
    return { ok: result.ok, error: result.error };
  }

  return { ok: false, error: "Provider does not support outbound delivery" };
}
