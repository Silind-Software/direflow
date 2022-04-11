# Install
install() {
  node ./scripts/node/installAll.js --test-setup

  cd cypress/test-setup
}

# Build
build() {
  npm run build

  cp build/direflowBundle.js public/direflowBundle.js

  npm run serve &
  wait-on http://localhost:5000
}

# CleanUp
cleanup() {
  rm cypress/test-setup/public/direflowBundle.js
  sleep 2

  echo "Cypress has finished testing"
  echo "Closing dev server ..."

  kill $(lsof -t -i:5000)
}
