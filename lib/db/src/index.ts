import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import {
  buildPgPoolConfig,
  preferIpv4ConnectionString,
  resolveDatabaseUrl,
} from "./pool-config";

const { Pool } = pg;

const connectionString = preferIpv4ConnectionString(resolveDatabaseUrl());
export const pool = new Pool(buildPgPoolConfig(connectionString));
export const db = drizzle(pool, { schema });

export async function pingDatabase(): Promise<void> {
  await pool.query("SELECT 1");
}

export * from "./schema";
