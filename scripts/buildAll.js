const fs = require('fs');
const { exec } = require('child_process');

install('.');

if (!fs.existsSync('packages')) {
  return;
}

const widgetsDirectory = fs.readdirSync('packages');

for (let directory of widgetsDirectory) {
  if (fs.statSync(`packages/${directory}`).isDirectory()) {
    install(`packages/${directory}`);
  }
}

function install(dir) {
  console.log('Beginning to build:', dir);

  exec(`cd ${dir} && tsc`, (err, out) => {
    if (err) {
      console.log(`✗ ${dir} could not build`);
      console.log(err);
      return;
    }
    
    console.log(`✓ ${dir} build succesfully`);
    out && console.log(out);
  });
}
