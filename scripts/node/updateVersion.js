const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const arg = process.argv[2];

if (!arg) {
  console.log('Provide a version number');
  return;
}

const rootPackage = require('../../package.json');
const componentPackage = require('../../packages/direflow-component/package.json');
const scriptPackage = require('../../packages/direflow-scripts/package.json');

let componentPackageJs = fs.readFileSync('templates/js/package.json').toString();
let componentPackageTs = fs.readFileSync('templates/ts/package.json').toString();

const componentRegex = /"direflow-component": "(.*)"/g;
const componentReplace = (r) => `"direflow-component": ${JSON.stringify(r)}`;

const scriptsRegex = /"direflow-scripts": "(.*)"/g;
const scriptsReplace = (r) => `"direflow-scripts": ${JSON.stringify(r)}`;

const updateLink = () => {
  const currentDirectory = process.cwd();

  if (!rootPackage.version.includes('-link')) {
    rootPackage.version = `${rootPackage.version}-link`;
  }

  if (!componentPackage.version.includes('-link')) {
    componentPackage.version = `${componentPackage.version}-link`;
  }

  if (!scriptPackage.version.includes('-link')) {
    scriptPackage.version = `${scriptPackage.version}-link`;
  }

  const componentPath = path.join(currentDirectory, 'packages', 'direflow-component');
  const scriptsPath = path.join(currentDirectory, 'packages', 'direflow-scripts');

  componentPackageJs = componentPackageJs
    .replace(componentRegex, componentReplace(componentPath))
    .replace(scriptsRegex, scriptsReplace(scriptsPath));

  componentPackageTs = componentPackageTs
    .replace(componentRegex, componentReplace(componentPath))
    .replace(scriptsRegex, scriptsReplace(scriptsPath));

  console.log('');
  console.log('Version have been set to use LINK.');
  console.log(`New version: ${rootPackage.version}`);
  console.log('');
};

const updateVersion = (version) => {
  rootPackage.version = version;
  componentPackage.version = version;
  scriptPackage.version = version;

  componentPackageJs = componentPackageJs
    .replace(componentRegex, componentReplace(version))
    .replace(scriptsRegex, scriptsReplace(version));

  componentPackageTs = componentPackageTs
    .replace(componentRegex, componentReplace(version))
    .replace(scriptsRegex, scriptsReplace(version));

  console.log('');
  console.log('Version have updated.');
  console.log(`New version: ${version}`);
  console.log('');
};

const writeToFiles = () => {
  fs.writeFileSync('package.json', JSON.stringify(rootPackage, null, 2), 'utf-8');
  fs.writeFileSync('packages/direflow-component/package.json', JSON.stringify(componentPackage, null, 2), 'utf-8');
  fs.writeFileSync('packages/direflow-scripts/package.json', JSON.stringify(scriptPackage, null, 2), 'utf-8');
  fs.writeFileSync('templates/js/package.json', componentPackageJs, 'utf-8');
  fs.writeFileSync('templates/ts/package.json', componentPackageTs, 'utf-8');
};

if (arg === 'patch') {
  const buffer = execSync('npm view direflow-cli version');
  const currentVersion = buffer.toString('utf8');

  if (
    currentVersion.trim() === rootPackage.version.trim()
    || rootPackage.version.includes('link')
  ) {
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
