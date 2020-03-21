# Install
node ./scripts/node/installAll.js --test-setup

cd cypress/test-setup

# Build
npm run build

rm public/direflowBundle.js
cp build/direflowBundle.js public/direflowBundle.js

npm start & wait-on http://localhost:5000

cd .. && cd ..
npm run cypress:run

sleep 2

echo "Cypress has finished testing"
echo "Closing dev server ..."

kill $(lsof -t -i:5000)
