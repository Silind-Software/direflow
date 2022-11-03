# Install
install() {
  node ./scripts/node/installAll.js --test-setup

  cd cypress/test-setup
}

# Build
build() {
  npm run build

  # Replace with pm2 and kill by id, not by port
  npm run serve &
  wait-on http://localhost:5000
}

# CleanUp
cleanup() {
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
