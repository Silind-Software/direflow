import fs from 'fs';
import chalk from 'chalk';
import { exec } from 'child_process';

async function installAllComponents(): Promise<void> {
  if (!fs.existsSync('direflow-components')) {
    console.log(chalk.white('No direflow components found. Nothing to install...'));
    return;
  }

  console.log('');
  console.log(chalk.blueBright('Please be patient'));
  console.log(chalk.blueBright('Installing all Direflow Components...'));
  console.log('');

  const componentsDirectory = fs.readdirSync('direflow-components');

  for (const directory of componentsDirectory) {
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

function triggerCommand(directory: string): Promise<string> {
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

installAllComponents();
