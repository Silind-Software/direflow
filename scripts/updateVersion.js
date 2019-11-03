const fs = require('fs');

const version = process.argv[2];

if (!version) {
  console.log('Provide a version number');
  return;
}

const rootPackage = require('../package.json');
const projectPackage = require('../packages/direflow-project/package.json');
const componentPackage = require('../packages/direflow-component/package.json');

const projectPackageJs = require('../templates/project-template/js/package.json');
const projectPackageTs = require('../templates/project-template/ts/package.json');
const componentPackageJs = require('../templates/component-template/js/package.json');
const componentPackageTs = require('../templates/component-template/ts/package.json');

if (version === 'link') {
  const currentDirectory = process.cwd();

  rootPackage.version = `${rootPackage.version}-link`;
  projectPackage.version = `${projectPackage.version}-link`;
  componentPackage.version = `${componentPackage.version}-link`;

  projectPackageJs.dependencies['direflow-project'] = `${currentDirectory}/packages/direflow-project`;
  projectPackageTs.dependencies['direflow-project'] = `${currentDirectory}/packages/direflow-project`;
  componentPackageJs.dependencies['direflow-component'] = `${currentDirectory}/packages/direflow-component`;
  componentPackageTs.dependencies['direflow-component'] = `${currentDirectory}/packages/direflow-component`;
} else {

  rootPackage.version = version;
  projectPackage.version = version;
  componentPackage.version = version;

  projectPackageJs.dependencies['direflow-project'] = version;
  projectPackageTs.dependencies['direflow-project'] = version;
  componentPackageJs.dependencies['direflow-component'] = version;
  componentPackageTs.dependencies['direflow-component'] = version;
}

fs.writeFileSync('package.json', JSON.stringify(rootPackage, null, 2), 'utf-8');
fs.writeFileSync('packages/direflow-project/package.json', JSON.stringify(projectPackage, null, 2), 'utf-8');
fs.writeFileSync('packages/direflow-component/package.json', JSON.stringify(componentPackage, null, 2), 'utf-8');
fs.writeFileSync('templates/project-template/js/package.json', JSON.stringify(projectPackageJs, null, 2), 'utf-8');
fs.writeFileSync('templates/project-template/ts/package.json', JSON.stringify(projectPackageTs, null, 2), 'utf-8');
fs.writeFileSync('templates/component-template/js/package.json', JSON.stringify(componentPackageJs, null, 2), 'utf-8');
fs.writeFileSync('templates/component-template/ts/package.json', JSON.stringify(componentPackageTs, null, 2), 'utf-8');
