import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const precisefectDir = path.join(root, "artifacts", "precisefect");
const apiDistDir = path.join(root, "artifacts", "api-server", "dist");
const frontendIndex = path.join(precisefectDir, "dist", "public", "index.html");
const bundledPublicIndex = path.join(apiDistDir, "public", "index.html");
const apiBundle = path.join(apiDistDir, "index.mjs");

function copyPublicAssets() {
  const publicSrc = path.join(precisefectDir, "dist", "public");
  const publicDest = path.join(apiDistDir, "public");
  if (!existsSync(path.join(publicSrc, "index.html"))) {
    throw new Error(`Missing frontend build at ${publicSrc}`);
  }
  cpSync(publicSrc, publicDest, { recursive: true });
  console.log("[build:prod] Copied frontend assets to artifacts/api-server/dist/public");
}

const skipCompile =
  !process.env.CI &&
  existsSync(frontendIndex) &&
  existsSync(apiBundle) &&
  existsSync(bundledPublicIndex);

if (skipCompile) {
  console.log(
    "[build:prod] CI-built artifacts found; skipping compile (required on Hostinger shared hosting).",
  );
  process.exit(0);
}

const env = {
  ...process.env,
  PORT: process.env.PORT ?? "3000",
  BASE_PATH: process.env.BASE_PATH ?? "/",
};

function run(label, args, cwd = root) {
  console.log(`[build:prod] ${label}`);
  const result = spawnSync(process.execPath, args, {
    cwd,
    env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(
  "precisefect",
  ["./node_modules/vite/bin/vite.js", "build", "--config", "vite.config.ts"],
  precisefectDir,
);
run("api-server", ["./artifacts/api-server/build.mjs"]);
copyPublicAssets();
