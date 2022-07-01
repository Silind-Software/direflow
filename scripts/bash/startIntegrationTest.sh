# Install
install() {
  node ./scripts/node/installAll.js --test-setup

  cd cypress/test-setup
}

# Build
build() {
  npm run build

  cp build/direflowBundle.js public/direflowBundle.js

  npm run serve -- -l 5000 &
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

install
build

cd .. && cd ..

if npm run cypress:run; then
  cleanup
  exit 0
else
  cleanup
  exit 1
fi
