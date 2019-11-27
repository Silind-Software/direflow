import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';

async function testAllComponents(): Promise<void> {
  if (!fs.existsSync('direflow-components')) {
    console.log(chalk.white('No direflow components found. Nothing to test...'));
    return;
  }

  const widgetsDirectory = fs.readdirSync('direflow-components');

  for (const directory of widgetsDirectory) {
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
    try {
      execSync(`cd direflow-components/${directory} && yarn test --watchAll=false`);
      resolve(`Tests passed: ${directory}`);
    } catch (err) {
      console.log(err);
      reject(`Tests failed: ${directory}`);
    }
  });
}

testAllComponents();
