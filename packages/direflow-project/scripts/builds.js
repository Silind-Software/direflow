const fs = require('fs');
const { exec, execSync } = require('child_process');
const { resolve } = require('path');
const chalk = require('chalk');

async function buildAllComponents() {
  if (!fs.existsSync('direflow-components')) {
    console.log(chalk.white('No direflow components found. Nothing to build...'));
    return;
  }

  console.log('');
  console.log(chalk.blueBright('Please be patient'));
  console.log(chalk.blueBright('Building all Direflow Components...'));
  console.log('');

  const componentsDirectory = fs.readdirSync('direflow-components');
  clearWidgetRegistry();

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
    if (!fs.existsSync(`direflow-components/${directory}/node_modules/`)) {
      console.log(chalk.blueBright(`${directory} has not been installed.`));
      console.log(chalk.white(`Install started: ${directory}`));
      execSync(`cd direflow-components/${directory} && yarn install`);
    }
  
    console.log(chalk.white(`Build started: ${directory}`));
    exec(`cd direflow-components/${directory} && yarn build`, (err) => {
      if (err) {
        console.log(err);
        reject(`Build failed: ${directory}`);
      }
  
      registerWidget(directory);
      resolve(`Build success: ${directory}`);
    });
  });
}

function registerWidget(directory) {
  const componentRegistrations = require('../config/componentRegistrations.json');
  const fullPath = `direflow-components/${directory}/build`;

  const widget = {
    name: directory,
    path: fullPath,
    bundle: 'componentBundle.js'
  }

  componentRegistrations.push(widget);

  const addedScript = `
  window.direflowComponents["${directory}"] = {
    onRegister: function(callback) {
      window.direflowComponents["${directory}"].callback = callback;
    }
  }`;

  fs.appendFileSync(resolve(__dirname, '../config/registerDireflowComponents.js'), addedScript);
  fs.writeFileSync(resolve(__dirname, '../config/componentRegistrations.json'), JSON.stringify(componentRegistrations, null, 2));
}

function clearWidgetRegistry() {
  fs.writeFileSync(resolve(__dirname, '../config/registerDireflowComponents.js'), 'window.direflowComponents = {};');
  fs.writeFileSync(resolve(__dirname, '../config/componentRegistrations.json'), JSON.stringify([]));
}

module.exports = {
  buildAllComponents
}