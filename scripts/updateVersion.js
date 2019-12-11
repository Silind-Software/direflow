const fs = require('fs');
const { execSync } = require('child_process');

const arg = process.argv[2];

if (!arg) {
  console.log('Provide a version number');
  return;
}

const rootPackage = require('../package.json');
const componentPackage = require('../packages/direflow-component/package.json');

const componentPackageJs = require('../templates/js/package.json');
const componentPackageTs = require('../templates/ts/package.json');

const updateLink = () => {
  const currentDirectory = process.cwd();

  if (!rootPackage.version.includes('-link')) {
    rootPackage.version = `${rootPackage.version}-link`;
  }

  if (!componentPackage.version.includes('-link')) {
    componentPackage.version = `${componentPackage.version}-link`;
  }

  componentPackageJs.dependencies['direflow-component'] = `${currentDirectory}/packages/direflow-component`;
  componentPackageTs.dependencies['direflow-component'] = `${currentDirectory}/packages/direflow-component`;

  console.log('');
  console.log('Version have been set to use LINK.');
  console.log(`New version: ${rootPackage.version}`);
  console.log('');
}

const updateVersion = (version) => {
  rootPackage.version = version;
  componentPackage.version = version;

  componentPackageJs.dependencies['direflow-component'] = version;
  componentPackageTs.dependencies['direflow-component'] = version;

  console.log('');
  console.log('Version have updated.');
  console.log(`New version: ${version}`);
  console.log('');
}

const writeToFiles = () => {
  fs.writeFileSync('package.json', JSON.stringify(rootPackage, null, 2), 'utf-8');
  fs.writeFileSync('packages/direflow-component/package.json', JSON.stringify(componentPackage, null, 2), 'utf-8');
  fs.writeFileSync('templates/js/package.json', JSON.stringify(componentPackageJs, null, 2), 'utf-8');
  fs.writeFileSync('templates/ts/package.json', JSON.stringify(componentPackageTs, null, 2), 'utf-8');
}

if (arg === 'patch') {
  const buffer = execSync('npm view direflow-cli version');
  const currentVersion = buffer.toString('utf8');

  if (currentVersion.trim() === rootPackage.version.trim() || rootPackage.version.includes('link')) {
    const versionNumbers = currentVersion.split('.');
    const patch = Number(versionNumbers[2]);
  
    const patchVersion = `${versionNumbers[0]}.${versionNumbers[1]}.${patch + 1}`;
  
    updateVersion(patchVersion);
    writeToFiles();
  }

  return;
}

if (arg === 'link') {
  updateLink();
  writeToFiles();
  return;
}

updateVersion(arg);
writeToFiles();
