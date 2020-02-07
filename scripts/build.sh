#!/usr/bin/env sh
set -e

enable_sentry='0'

# Current branch
if [ -n "$NOW_GITHUB_COMMIT_REF" ]; then
  # ZEIT Now (no .git but an env var)
  branch=$NOW_GITHUB_COMMIT_REF
else
  # Other environments
  branch=$(git symbolic-ref --short -q HEAD)
fi

if [ "$branch" = 'development' ] || [ "$branch" = 'master' ]; then
  enable_sentry='1'
fi

# Build number from the short hash
if [ -n "$NOW_GITHUB_COMMIT_SHA" ]; then
  build=$(git rev-parse --short "$NOW_GITHUB_COMMIT_SHA")
else
  build=$(git log --pretty=format:'%h' -n 1)
fi

echo "Branch: $branch"
echo "Build: $build"
echo "Enable Sentry: $enable_sentry"
echo ""

echo "Syncing assets…"
echo ""
npm run sync-assets

echo "Building app…"
echo ""
REACT_APP_ENABLE_SENTRY=$enable_sentry REACT_APP_BUILD=$build npx react-app-rewired build
