# Install
node ./scripts/node/installAll.js --test-setup

cd cypress/test-setup

# Build
npm run build

cp build/direflowBundle.js public/direflowBundle.js

npm start & wait-on http://localhost:5000

cd .. && cd ..
npm run cypress:run

rm cypress/test-setup/public/direflowBundle.js
sleep 2

echo "Cypress has finished testing"
echo "Closing dev server ..."

kill $(lsof -t -i:5000)
