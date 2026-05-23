import type pg from "pg";

/** Normalize DATABASE_URL (quotes, whitespace) and set SSL / pooler options for Supabase. */
export function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "DATABASE_URL must be set. Use your Supabase Postgres URI (Dashboard → Project Settings → Database).",
    );
  }
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

export function buildPgPoolConfig(connectionString: string): pg.PoolConfig {
  const config: pg.PoolConfig = { connectionString };

  try {
    const url = new URL(connectionString.replace(/^postgres:/, "postgresql:"));
    const sslmode = url.searchParams.get("sslmode");
    const host = url.hostname;

    const needsSsl =
      sslmode === "require" ||
      sslmode === "verify-full" ||
      sslmode === "verify-ca" ||
      host.endsWith(".supabase.co");

    if (needsSsl) {
      config.ssl = { rejectUnauthorized: false };
    }

    // Supavisor / PgBouncer transaction pooler (port 6543)
    if (url.port === "6543" || url.searchParams.get("pgbouncer") === "true") {
      config.max = Math.min(config.max ?? 10, 5);
    }
  } catch {
    if (connectionString.includes("supabase.co")) {
      config.ssl = { rejectUnauthorized: false };
    }
  }

  return config;
}
