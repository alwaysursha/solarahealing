#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

GITHUB_USER="${GITHUB_USER:-alwaysursha}"
REPO_NAME="${REPO_NAME:-solarahealing}"
BRANCH="${BRANCH:-main}"

echo "==> Soulara Healing Academy deploy setup"
echo "    GitHub: ${GITHUB_USER}/${REPO_NAME}"
echo "    Cloudflare account: soularahealer@gmail.com"
echo

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init -b "$BRANCH"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is not installed."
  echo "Install: brew install gh"
  echo "Then run: gh auth login"
  echo
  echo "Or create the repo manually:"
  echo "  https://github.com/new?name=${REPO_NAME}"
  echo "Then run:"
  echo "  git remote add origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
  echo "  git add -A && git commit -m \"Initial commit\""
  echo "  git push -u origin ${BRANCH}"
else
  if ! gh auth status >/dev/null 2>&1; then
    echo "Log in to GitHub as ${GITHUB_USER}:"
    gh auth login
  fi

  if ! gh repo view "${GITHUB_USER}/${REPO_NAME}" >/dev/null 2>&1; then
    gh repo create "${REPO_NAME}" --private --source=. --remote=origin --description "Soulara Healing Academy website"
    echo "Created https://github.com/${GITHUB_USER}/${REPO_NAME}"
  else
    echo "Repo already exists: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    git remote add origin "git@github.com:${GITHUB_USER}/${REPO_NAME}.git" 2>/dev/null || \
      git remote set-url origin "git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
  fi
fi

echo
echo "==> Cloudflare (log in with soularahealer@gmail.com when the browser opens)"
pnpm exec wrangler whoami 2>/dev/null || pnpm exec wrangler login

echo
echo "Account ID (save for GitHub secrets):"
pnpm exec wrangler whoami

echo
echo "Create an API token for CI:"
echo "  https://dash.cloudflare.com/profile/api-tokens"
echo "  Template: Edit Cloudflare Workers"
echo
echo "One-time database setup (from your machine, not CI):"
echo "  pnpm db:setup"
echo
echo "Add GitHub repository secrets:"
echo "  CLOUDFLARE_API_TOKEN"
echo "  DATABASE_URL"
echo "  AUTH_SECRET"
echo "  GOOGLE_CLIENT_ID (optional)"
echo "  GOOGLE_CLIENT_SECRET (optional)"
echo "  STRIPE_SECRET_KEY (test sk_test_… for now)"
echo "  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (test pk_test_…)"
echo "  STRIPE_WEBHOOK_SECRET (optional until live webhooks)"
echo
echo "Also set the same Stripe keys as Cloudflare Worker secrets:"
echo "  pnpm exec wrangler secret put STRIPE_SECRET_KEY"
echo "  pnpm exec wrangler secret put NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo
echo "Local deploy:"
echo "  pnpm run deploy:cf"
echo
echo "Optional: connect the repo in Cloudflare dashboard for Git-based deploys:"
echo "  https://dash.cloudflare.com/?to=/:account/workers-and-pages"
