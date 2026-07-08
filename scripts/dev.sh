#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"

ulimit -n 10240 2>/dev/null || true

for p in 3000 3001 3002 3100 3101 "$PORT"; do
  lsof -ti :"$p" | xargs kill -9 2>/dev/null || true
done
sleep 1

rm -rf .next

export WATCHPACK_POLLING=true
echo "→ Starting at http://127.0.0.1:${PORT}"
exec pnpm exec next dev --hostname 127.0.0.1 --port "$PORT" --webpack
