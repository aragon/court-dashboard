#!/usr/bin/env sh
set -e

pwd
ls -la
printenv

enable_sentry='0'
branch=$(git symbolic-ref --short -q HEAD)

if [ "$branch" = 'development' ] || [ "$branch" = 'master' ]; then
  enable_sentry='1'
fi

build=$(git log --pretty=format:'%h' -n 1)

echo "REACT_APP_ENABLE_SENTRY=$enable_sentry"
echo "REACT_APP_BUILD=$build"

npm run sync-assets && REACT_APP_ENABLE_SENTRY=$enable_sentry REACT_APP_BUILD=$build npx react-app-rewired build
