#!/usr/bin/env sh
set -e

enable_sentry='0'

# Current branch
if [ -n "$NOW_GITHUB_COMMIT_REF" ]; then
  # ZEIT Now (no .git but an env var)
  branch=$NOW_GITHUB_COMMIT_REF
elif [ -n "$GITHUB_REF" ]; then
  # Github Action
  branch=$GITHUB_REF
else
  # Other environments
  branch=$(git symbolic-ref --short -q HEAD)
fi

if [ "$branch" = 'development' ] || [ "$branch" = 'master' ]; then
  enable_sentry='1'
fi

# Build number from the short hash
if [ -n "$NOW_GITHUB_COMMIT_SHA" ]; then
  build=$(echo "$NOW_GITHUB_COMMIT_SHA" | cut -c1-7)
elif [ -n "$GITHUB_SHA" ]; then
  build=$(echo "$GITHUB_SHA" | cut -c1-7)
else
  build=$(git log --pretty=format:'%h' -n 1)
fi

# Get package version
version=$(jq '.version' ../package.json)

echo "Branch: $branch"
echo "Build: $build"
echo "Enable Sentry: $enable_sentry"
echo "Package version: $version"
echo ""

echo "Syncing assets…"
echo ""
npm run sync-assets

echo "Building app…"
echo ""
cross-env REACT_APP_PACKAGE_VERSION=$version REACT_APP_ENABLE_SENTRY=$enable_sentry REACT_APP_BUILD=$build npx react-app-rewired build
