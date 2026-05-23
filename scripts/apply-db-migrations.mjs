/**
 * Apply lib/db/migrations/*.sql in order to DATABASE_DIRECT_URL or DATABASE_URL.
 * Usage (from repo root):
 *   node scripts/apply-db-migrations.mjs
 */
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

function loadEnv() {
  const path = resolve(import.meta.dirname, "..", ".env");
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i > 0 && !process.env[t.slice(0, i).trim()])
        process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  } catch {
    // .env optional if env vars already set
  }
}

loadEnv();

const url = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL or DATABASE_DIRECT_URL.");
  process.exit(1);
}

const migrationsDir = resolve(import.meta.dirname, "..", "lib", "db", "migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql") && f !== "production-leads-bundle.sql")
  .sort();

const pool = new pg.Pool({ connectionString: url });

console.log(`Applying ${files.length} migration file(s) to database…`);

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  process.stdout.write(`  ${file} … `);
  try {
    await pool.query(sql);
    console.log("ok");
  } catch (err) {
    console.log("failed");
    console.error(err);
    await pool.end();
    process.exit(1);
  }
}

const { rows } = await pool.query(
  `SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' AND column_name IN ('score', 'score_breakdown') ORDER BY 1`,
);
console.log("Leads scoring columns:", rows.map((r) => r.column_name).join(", ") || "(missing)");

const { rows: count } = await pool.query(`SELECT COUNT(*)::int AS n FROM leads`);
console.log(`Leads table ready (${count[0].n} row(s)).`);

await pool.end();
console.log("Done.");
