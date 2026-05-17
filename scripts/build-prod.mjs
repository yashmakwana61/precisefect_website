import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const precisefectDir = path.join(root, "artifacts", "precisefect");
const apiDistDir = path.join(root, "artifacts", "api-server", "dist");
const frontendIndex = path.join(precisefectDir, "dist", "public", "index.html");
const apiBundle = path.join(apiDistDir, "index.mjs");

function copyPublicAssets() {
  const publicSrc = path.join(precisefectDir, "dist", "public");
  const publicDest = path.join(apiDistDir, "public");
  if (!existsSync(path.join(publicSrc, "index.html"))) {
    throw new Error(`Missing frontend build at ${publicSrc}`);
  }
  cpSync(publicSrc, publicDest, { recursive: true });
  syncRootPublicFiles(publicDest);
  console.log("[build:prod] Copied frontend assets to artifacts/api-server/dist/public");
}

function syncRootPublicFiles(...destRoots) {
  const rootPublic = path.join(precisefectDir, "public");
  if (!existsSync(rootPublic)) return;
  for (const destRoot of destRoots) {
    if (!existsSync(destRoot)) continue;
    cpSync(rootPublic, destRoot, { recursive: true });
  }
}

/** GitHub Actions artifact job must compile; Hostinger/shared hosting must not. */
function shouldCompileOnThisMachine() {
  if (process.env.FORCE_PROD_BUILD === "1") return true;
  if (process.env.GITHUB_ACTIONS === "true") return true;
  if (process.env.CI === "true" && process.env.HOSTINGER !== "1") return true;
  return false;
}

function canUsePublishedArtifacts() {
  return existsSync(frontendIndex) && existsSync(apiBundle);
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

if (canUsePublishedArtifacts() && !shouldCompileOnThisMachine()) {
  copyPublicAssets();
  syncRootPublicFiles(path.join(precisefectDir, "dist", "public"));
  console.log(
    "[build:prod] Using CI-published artifacts (no esbuild/vite on this host).",
  );
  process.exit(0);
}

if (!shouldCompileOnThisMachine()) {
  console.error(
    "[build:prod] Missing CI artifacts. Push to main and wait for GitHub Actions, or set FORCE_PROD_BUILD=1 on a machine that can run esbuild.",
  );
  console.error(`  expected: ${frontendIndex}`);
  console.error(`  expected: ${apiBundle}`);
  process.exit(1);
}

run(
  "precisefect",
  ["./node_modules/vite/bin/vite.js", "build", "--config", "vite.config.ts"],
  precisefectDir,
);
run("api-server", ["./artifacts/api-server/build.mjs"]);
copyPublicAssets();
