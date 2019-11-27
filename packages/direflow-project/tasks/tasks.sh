#!/usr/bin/env bash

if [[ $1 == 'start' ]]; then
  echo ""
  echo "All Direflow Components will be built and served with the Direflow Project..."
  echo "Development server will start after this process has finished."

  node ./node_modules/direflow-project/dist/scripts/builds.js
  node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --config ./node_modules/direflow-project/config/config.development.js
fi

if [[ $1 == 'build' ]]; then
  node ./node_modules/direflow-project/dist/scripts/builds.js
  node ./node_modules/webpack/bin/webpack.js --config ./node_modules/direflow-project/config/config.production.js
fi

if [[ $1 == 'install-all' ]]; then
  node ./node_modules/direflow-project/dist/scripts/installs.js
fi

if [[ $1 == 'test-all' ]]; then
  node ./node_modules/direflow-project/dist/scripts/tests.js
fi

if [[ $1 == 'build-all' ]]; then
  node ./node_modules/direflow-project/dist/scripts/builds.js
fi
