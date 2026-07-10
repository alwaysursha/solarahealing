#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! grep -q "D1_DATABASE_ID_PLACEHOLDER" wrangler.jsonc; then
  echo "D1 database id is already configured in wrangler.jsonc"
  exit 0
fi

echo "==> Creating Cloudflare D1 database: solarahealing"
if pnpm exec wrangler d1 create solarahealing --binding DB --update-config; then
  echo "==> wrangler.jsonc updated with your D1 database id"
  exit 0
fi

echo "==> Create failed (database may already exist). Resolving existing id..."
DB_ID="$(pnpm exec wrangler d1 info solarahealing 2>/dev/null | awk '/database_id/ {print $3; exit}')"
if [ -z "$DB_ID" ]; then
  DB_ID="$(pnpm exec wrangler d1 list | awk '/solarahealing/ {print $1; exit}')"
fi

if [ -z "$DB_ID" ]; then
  echo "Could not resolve D1 database id. Run:"
  echo "  pnpm exec wrangler d1 create solarahealing --binding DB --update-config"
  exit 1
fi

if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' "s/D1_DATABASE_ID_PLACEHOLDER/${DB_ID}/g" wrangler.jsonc
else
  sed -i "s/D1_DATABASE_ID_PLACEHOLDER/${DB_ID}/g" wrangler.jsonc
fi
echo "==> Patched wrangler.jsonc with database id: ${DB_ID}"
