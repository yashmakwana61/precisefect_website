import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const required = [
  path.join(root, "artifacts", "precisefect", "dist", "public", "index.html"),
  path.join(root, "artifacts", "api-server", "dist", "index.mjs"),
];

const missing = required.filter((p) => !existsSync(p));
if (missing.length > 0) {
  console.error("Hostinger: missing CI-built artifacts in this checkout:");
  for (const p of missing) console.error(`  - ${p}`);
  console.error("Wait for the GitHub Actions 'hostinger-artifacts' job on main, then redeploy.");
  process.exit(1);
}

console.log("Hostinger: syncing published frontend into api-server/dist/public …");
const result = spawnSync(process.execPath, ["scripts/build-prod.mjs"], {
  cwd: root,
  env: { ...process.env, HOSTINGER: "1" },
  stdio: "inherit",
});
process.exit(result.status ?? 1);
