import dns from "node:dns";
import type pg from "pg";

/** Force IPv4 when pg resolves the database host (Hostinger cannot use Supabase over IPv6). */
function ipv4Lookup(
  hostname: string,
  options: dns.LookupOptions,
  callback: (
    err: NodeJS.ErrnoException | null,
    address: string,
    family: number,
  ) => void,
): void {
  dns.lookup(hostname, { ...options, family: 4 }, callback);
}

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
  const isSupabase = connectionString.includes("supabase.co");

  try {
    const url = new URL(connectionString.replace(/^postgres:/, "postgresql:"));
    const sslmode = url.searchParams.get("sslmode");
    const needsSsl =
      sslmode === "require" ||
      sslmode === "verify-full" ||
      sslmode === "verify-ca" ||
      url.hostname.endsWith(".supabase.co") ||
      isSupabase;

    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, "") || "postgres",
      lookup: ipv4Lookup,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
      max: url.port === "6543" || url.searchParams.get("pgbouncer") === "true" ? 5 : 10,
    } as pg.PoolConfig;
  } catch {
    return {
      connectionString,
      lookup: ipv4Lookup,
      ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    } as pg.PoolConfig;
  }
}
