#!/usr/bin/env sh
set -e

echo "Branch: $branch"
echo "Build: $build"
echo "Enable Sentry: $enable_sentry"
echo ""

echo "Syncing assets…"
echo ""
npm run sync-assets

echo "Building app…"
echo ""
cross-env REACT_APP_ENABLE_SENTRY=$enable_sentry REACT_APP_BUILD=$build npx react-app-rewired build
