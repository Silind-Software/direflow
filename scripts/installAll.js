const fs = require('fs');
const { exec, execSync } = require('child_process');

async function installAll() {
  await install('.');

  if (!fs.existsSync('packages')) {
    return;
  }

  const widgetsDirectory = fs.readdirSync('packages');

  for (let directory of widgetsDirectory) {
    if (fs.statSync(`packages/${directory}`).isDirectory()) {
      await install(`packages/${directory}`);
    }
  }
}

function install(dir) {
  return new Promise(async (resolve, reject) => {
    console.log('Beginning to install: ', dir);

    await new Promise((resolve) => {
      exec(`cd ${dir} && yarn`, (err, out) => {
        if (err) {
          console.log(`✗ ${dir} could not install`);
          console.log(err);
          reject();
        }
        
        console.log(`✓ ${dir} installed succesfully`);
        out && console.log(out);
        resolve();
      });
    });
    
    if (process.argv[2] === '--no-deps') {
      resolve();
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(`${dir}/package.json`));
    const peerDeps = packageJson.peerDependencies;

    if (peerDeps) {
      for ([package, version] of Object.entries(peerDeps)) {
        execSync(`cd ${dir} && yarn add ${package}@${version}`);
        console.log(`✓ ${package}@${version} peer dependency installed succesfully`);
      }

      fs.writeFileSync(`${dir}/package.json`, JSON.stringify(packageJson, null, 2), 'utf-8');
    }

    resolve();
  });
}

installAll();