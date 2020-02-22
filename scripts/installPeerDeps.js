const { execSync } = require('child_process');
const fs = require('fs');

const package = require('../packages/direflow-component/package.json');

const peerDeps = package.peerDependencies;

Object.entries(peerDeps).forEach(([peerPackage, version]) => {
  const cmd = `cd packages/direflow-component && yarn add ${peerPackage}@${version}`;
  execSync(cmd);
});

fs.writeFileSync('packages/direflow-component/package.json', JSON.stringify(package, null, 2), 'utf-8');
