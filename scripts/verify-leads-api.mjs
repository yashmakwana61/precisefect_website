/**
 * Verify leads schema + optional API test.
 *   node scripts/verify-leads-api.mjs
 *   node scripts/verify-leads-api.mjs --api https://precisefect.com
 */
import pg from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const path = resolve(import.meta.dirname, "..", ".env");
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0 && !process.env[t.slice(0, i).trim()])
      process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

loadEnv();

const apiBase = process.argv.includes("--api")
  ? process.argv[process.argv.indexOf("--api") + 1]
  : null;

const url = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set.");
  process.exit(1);
}

const host = new URL(url.replace(/^postgres:/, "postgresql:")).hostname;
console.log("Database host:", host);

const pool = new pg.Pool({ connectionString: url });

const { rows: cols } = await pool.query(
  `SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY 1`,
);
if (cols.length === 0) {
  console.error("FAIL: leads table missing. Run lib/db/migrations/production-leads-bundle.sql");
  await pool.end();
  process.exit(1);
}

const names = cols.map((r) => r.column_name);
const required = ["score", "score_breakdown"];
const missing = required.filter((c) => !names.includes(c));
if (missing.length) {
  console.error("FAIL: missing columns:", missing.join(", "));
  await pool.end();
  process.exit(1);
}

console.log("OK: leads table has", names.length, "columns including score.");

await pool.end();

if (apiBase) {
  const body = {
    name: "API Verify",
    email: "verify@example.com",
    phone: "9876543210",
    businessType: "Retail",
    message: "Automated verification message",
  };
  const res = await fetch(`${apiBase.replace(/\/$/, "")}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`API ${res.status}:`, text);
  process.exit(res.ok ? 0 : 1);
}
