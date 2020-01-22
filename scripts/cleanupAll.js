const fs = require('fs');
const { exec } = require('child_process');

cleanDeps('.');

if (!fs.existsSync('packages')) {
  return;
}

const widgetsDirectory = fs.readdirSync('packages');

for (let directory of widgetsDirectory) {
  if (fs.statSync(`packages/${directory}`).isDirectory()) {
    cleanDeps(`packages/${directory}`);
  }
}

function cleanDeps(dir) {
  console.log('Beginning to clean:', dir);

  if (fs.existsSync(`${dir}/yarn.lock`)) {
    exec(`rm ${dir}/yarn.lock`, (err, out) => {
      if (err) {
        console.log(`✗ ${dir}/yarn.lock FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/yarn.lock is REMOVED`);
      out && console.log(out);
    });
  }

  if (fs.existsSync(`${dir}/package-lock.json`)) {
    exec(`rm ${dir}/package-lock.json`, (err, out) => {
      if (err) {
        console.log(`✗ ${dir}/package-lock.json FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/package-lock.json is REMOVED`);
      out && console.log(out);
    });
  }

  if (fs.existsSync(`${dir}/node_modules`)) {
    exec(`rm -rf ${dir}/node_modules`, (err, out) => {
      if (err) {
        console.log(`✗ ${dir}/node_modules FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/node_modules is REMOVED`);
      out && console.log(out);
    });
  }

  if (fs.existsSync(`${dir}/dist`)) {
    exec(`rm -rf ${dir}/dist`, (err, out) => {
      if (err) {
        console.log(`✗ ${dir}/dist FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/dist is REMOVED`);
      out && console.log(out);
    });
  }

  if (dir === 'packages/direflow-component') {
    if (fs.existsSync(`${dir}/config-overrides.js`)) {
      exec(`rm ${dir}/config-overrides.js`, (err, out) => {
        if (err) {
          console.log(`✗ ${dir}/config-overrides.js FAILED to remove`);
          console.log(err);
          return;
        }

        console.log(`✓ ${dir}/config-overrides.js is REMOVED`);
        out && console.log(out);
      });
    }
    if (fs.existsSync(`${dir}/config-overrides.d.ts`)) {
      exec(`rm ${dir}/config-overrides.d.ts`, (err, out) => {
        if (err) {
          console.log(`✗ ${dir}/config-overrides.d.ts FAILED to remove`);
          console.log(err);
          return;
        }

        console.log(`✓ ${dir}/config-overrides.d.ts is REMOVED`);
        out && console.log(out);
      });
    }
  }
}
