const fs = require('fs');
const { exec } = require('child_process');

build('.');

if (!fs.existsSync('packages')) {
  return;
}

const widgetsDirectory = fs.readdirSync('packages');

// eslint-disable-next-line no-restricted-syntax
for (const directory of widgetsDirectory) {
  if (fs.statSync(`packages/${directory}`).isDirectory()) {
    build(`packages/${directory}`);
  }
}

function build(dir) {
  console.log('Beginning to build:', dir);

  exec(`cd ${dir} && npm run build`, (err) => {
    if (err) {
      console.log(`✗ ${dir} could not build`);
      console.log(err);
      return;
    }

    console.log(`✓ ${dir} build succesfully`);
  });
}
