import fs from 'fs';
import chalk from 'chalk';
import { promisify } from 'util';
import cp from 'child_process';

const exec = promisify(cp.exec);
const stat = promisify(fs.stat);
const exists = promisify(fs.exists);

async function installAllComponents(): Promise<void> {
  if (!(await exists('direflow-components'))) {
    console.log(chalk.white('No direflow components found. Nothing to install...'));
    return;
  }

  console.log('');
  console.log(chalk.blueBright('Please be patient'));
  console.log(chalk.blueBright('Installing all Direflow Components...'));
  console.log('');

  const componentsDirectory = fs.readdirSync('direflow-components');

  for (const directory of componentsDirectory) {
    if ((await stat(`direflow-components/${directory}`)).isDirectory()) {
      try {
        await exec(`cd direflow-components/${directory} && ../../node_modules/direflow-project/node_modules/yarn/bin/yarn install`);
        console.log(chalk.greenBright(`Install success: ${directory}`));
      } catch (err) {
        console.log(chalk.red(`Install failed: ${directory}`));
        console.log(err);
        process.exit(1);
      }
    }
  }
}

installAllComponents();
