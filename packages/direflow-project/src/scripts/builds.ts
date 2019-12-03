import fs from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { promisify } from 'util';
import cp from 'child_process';

const exec = promisify(cp.exec);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const exists = promisify(fs.exists);

async function buildAllComponents(): Promise<void> {
  if (!fs.existsSync('direflow-components')) {
    console.log(chalk.white('No direflow components found. Nothing to build...'));
    return;
  }

  console.log('');
  console.log(chalk.blueBright('Please be patient'));
  console.log(chalk.blueBright('Building all Direflow Components...'));
  console.log('');

  await clearWidgetRegistry();
  const componentsDirectory = await readdir('direflow-components');

  for (const directory of componentsDirectory) {
    if ((await stat(`direflow-components/${directory}`)).isDirectory()) {
      if (!(await exists(`direflow-components/${directory}/node_modules/`))) {
        await installWidget(directory);
      }

      console.log(chalk.white(`Build started: ${directory}`));

      try {
        await exec(`cd direflow-components/${directory} && ../../node_modules/direflow-project/node_modules/yarn/bin/yarn build`);
        registerWidget(directory);

        console.log(chalk.greenBright(`Build success: ${directory}`));
      } catch (err) {
        console.log(chalk.red(`Build failed: ${directory}`));
        console.log(err);
        process.exit(1);
      }
    }
  }
}

async function installWidget(directory: string): Promise<void> {
  console.log(chalk.blueBright(`${directory} has not been installed.`));
  console.log(chalk.white(`Install started: ${directory}`));

  try {
    await exec(`cd direflow-components/${directory} && ../../node_modules/direflow-project/node_modules/yarn/bin/yarn install`);
    console.log(chalk.greenBright(`Install success: ${directory}`));
  } catch (err) {
    console.log(chalk.red(`Install failed: ${directory}`));
    console.log(err);
    process.exit(1);
  }
}

async function registerWidget(directory: string): Promise<void> {
  const componentRegistrations = require('../../config/componentRegistrations.json');
  const fullPath = `direflow-components/${directory}/build`;

  const widget = {
    name: directory,
    path: fullPath,
    bundle: 'componentBundle.js',
  };

  componentRegistrations.push(widget);

  const addedScript = `
  window.direflowComponents["${directory}"] = {
    onRegister: function(callback) {
      window.direflowComponents["${directory}"].callback = callback;
    }
  }`;

  await appendFile(resolve(__dirname, '../../config/registerDireflowComponents.js'), addedScript);
  await writeFile(
    resolve(__dirname, '../../config/componentRegistrations.json'),
    JSON.stringify(componentRegistrations, null, 2),
  );
}

async function clearWidgetRegistry(): Promise<void> {
  await Promise.all([
    writeFile(resolve(__dirname, '../../config/registerDireflowComponents.js'), 'window.direflowComponents = {};'),
    writeFile(resolve(__dirname, '../../config/componentRegistrations.json'), JSON.stringify([])),
  ]);
}

buildAllComponents();
