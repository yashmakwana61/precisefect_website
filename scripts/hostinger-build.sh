#!/usr/bin/env bash
# Hostinger shared hosting cannot execute esbuild/rollup native binaries (EACCES).
# Production builds run in GitHub Actions and are committed to main automatically.
# In hPanel use:
#   Install: npm run hostinger:install
#   Build:   npm run hostinger:build
#   Start:   npm run start:prod
set -euo pipefail
cd "$(dirname "$0")/.."

echo "This script is for local/VPS builds only. On Hostinger, use CI-published artifacts."
echo "See package.json scripts: hostinger:install, hostinger:build, start:prod"

export PORT="${PORT:-3000}"
export BASE_PATH="${BASE_PATH:-/}"

pnpm install --frozen-lockfile
node scripts/build-prod.mjs

echo "Done. Start with: npm run start:prod"
