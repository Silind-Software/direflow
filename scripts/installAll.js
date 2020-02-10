const fs = require('fs');
const { exec, execSync } = require('child_process');

async function installAll() {
  await install('.');

  if (!fs.existsSync('packages')) {
    return;
  }

  const widgetsDirectory = fs.readdirSync('packages');

  // eslint-disable-next-line no-restricted-syntax
  for (const directory of widgetsDirectory) {
    if (fs.statSync(`packages/${directory}`).isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      await install(`packages/${directory}`);
    }
  }
}

function install(dir) {
  return new Promise(async (resolve, reject) => {
    console.log('Beginning to install: ', dir);

    await new Promise((subResolve) => {
      exec(`cd ${dir} && yarn`, (err) => {
        if (err) {
          console.log(`✗ ${dir} could not install`);
          console.log(err);
          reject();
        }

        console.log(`✓ ${dir} installed succesfully`);
        subResolve();
      });
    });

    if (process.argv[2] === '--no-deps') {
      resolve();
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(`${dir}/package.json`));
    const peerDeps = packageJson.peerDependencies;

    if (peerDeps) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [package, version] of Object.entries(peerDeps)) {
        execSync(`cd ${dir} && yarn add ${package}@${version}`);
        console.log(`✓ ${package}@${version} peer dependency installed succesfully`);
      }

      fs.writeFileSync(`${dir}/package.json`, JSON.stringify(packageJson, null, 2), 'utf-8');
    }

    resolve();
  });
}

installAll();
