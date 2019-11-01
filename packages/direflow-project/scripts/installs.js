const fs = require('fs');
const { exec } = require('child_process');
const chalk = require('chalk');

async function installAllComponents() {
  if (!fs.existsSync('direflow-components')) {
    console.log(chalk.white('No direflow components found. Nothing to install...'));
    return;
  }

  console.log('');
  console.log(chalk.blueBright('Please be patient'));
  console.log(chalk.blueBright('Installing all Direflow Components...'));
  console.log('');

  const componentsDirectory = fs.readdirSync('direflow-components');

  for (let directory of componentsDirectory) {
    if (fs.statSync(`direflow-components/${directory}`).isDirectory()) {
      try {
        const result = await triggerCommand(directory);
        console.log(chalk.greenBright(result));
      } catch (err) {
        console.log(chalk.red(err));
        process.exit(1);
      }
    }
  }
}

function triggerCommand(directory) {
  return new Promise((resolve, reject) => {
    console.log(chalk.white(`Install started: ${directory}`));
    exec(`cd direflow-components/${directory} && yarn install`, (err) => {
      if (err) {
        console.log(err);
        reject(`Install failed: ${directory}`);
      }

      resolve(`Install success: ${directory}`);
    });
  });
}

module.exports = {
  installAllComponents
}