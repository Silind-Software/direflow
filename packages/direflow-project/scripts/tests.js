const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function testAllComponents() {
  if (!fs.existsSync('direflow-components')) {
    console.log(chalk.white('No direflow components found. Nothing to test...'));
    return;
  }

  const widgetsDirectory = fs.readdirSync('direflow-components');

  for (let directory of widgetsDirectory) {
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
    try {
      execSync(`cd direflow-components/${directory} && yarn test --watchAll=false`);
      resolve(`Tests passed: ${directory}`);
    } catch (err) {
      console.log(err);
      reject(`Tests failed: ${directory}`);
    }
  });
}

module.exports = {
  testAllComponents
}