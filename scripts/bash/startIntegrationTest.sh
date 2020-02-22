cd cypress/test-setup
yarn start & wait-on http://localhost:3000

cd .. && cd ..
yarn cypress:run

sleep 2

kill $(lsof -t -i:3000)
