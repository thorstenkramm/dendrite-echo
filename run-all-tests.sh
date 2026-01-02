#!/usr/bin/env bash

set -e

# ESLint
npm run lint
echo " ✅ ESLint ================================================================="
echo ""

# Code duplication check
npx jscpd --pattern "**/*.ts" --ignore "**/node_modules/**" --threshold 0 --exitCode 1
echo " ✅ Code duplication check =================================================="
echo ""

npm run type-check
echo " ✅ Type check =============================================================="
echo ""

npx vitest run
echo " ✅ Unit tests =============================================================="
echo ""

npm run build
echo " ✅ Production build ========================================================"
echo ""

# Markdown lint
npx markdownlint-cli "**/*.md" --ignore ./tmp/ --ignore ./node_modules/ --ignore ./dist/
echo " ✅ markdownlint ============================================================"
echo ""

# E2E tests (requires dev server running)
if curl -s http://127.0.0.1:5173 > /dev/null 2>&1; then
  npm run test:e2e -- --browser electron
  echo " ✅ E2E tests ============================================"
else
  echo " ⚠️  E2E tests skipped (dev server not running)"
fi

# Trivy scan
trivy repository ./ --skip-version-check
echo " ✅ trivy scan ============================================="