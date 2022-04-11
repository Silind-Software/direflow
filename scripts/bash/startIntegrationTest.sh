. scripts/bash/testSetupUtil.sh

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
