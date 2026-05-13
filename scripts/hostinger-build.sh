#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PORT="${PORT:-3000}"
export BASE_PATH="${BASE_PATH:-/}"

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building frontend and API..."
node scripts/build-prod.mjs

echo "Done. Start with: pnpm run start:prod"
echo "Or with PM2: pm2 start ecosystem.config.cjs"
