const fs = require('fs');
const { exec } = require('child_process');

build('.');

if (!fs.existsSync('packages')) {
  return;
}

const widgetsDirectory = fs.readdirSync('packages');

for (let directory of widgetsDirectory) {
  if (fs.statSync(`packages/${directory}`).isDirectory()) {
    build(`packages/${directory}`);
  }
}

function build(dir) {
  console.log('Beginning to build:', dir);

  exec(`cd ${dir} && yarn build`, (err, out) => {
    if (err) {
      console.log(`✗ ${dir} could not build`);
      console.log(err);
      return;
    }

    if (dir === 'packages/direflow-component') {
      exec(`mv ${dir}/dist/config/config-overrides.js ${dir}/config-overrides.js`, (err) => {
        if (err) {
          console.log(`✗ failed to move config-overrides.js`);
          console.log(err);
          return;
        }

        console.log(`✓ config-overrides.js moved succesfully`);
      })

      exec(`mv ${dir}/dist/config/config-overrides.d.ts ${dir}/config-overrides.d.ts`, (err) => {
        if (err) {
          console.log(`✗ failed to move config-overrides.d.ts`);
          console.log(err);
          return;
        }

        console.log(`✓ config-overrides.d.ts moved succesfully`);
      })
    }

    console.log(`✓ ${dir} build succesfully`);
    out && console.log(out);
  });
}
