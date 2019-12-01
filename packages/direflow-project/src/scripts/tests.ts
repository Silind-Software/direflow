import fs from 'fs';
import chalk from 'chalk';
import { promisify } from 'util';
import cp from 'child_process';

const exec = promisify(cp.exec);
const stat = promisify(fs.stat);
const exists = promisify(fs.exists);

async function testAllComponents(): Promise<void> {
  if (!(await exists('direflow-components'))) {
    console.log(chalk.white('No direflow components found. Nothing to test...'));
    return;
  }

  const componentsDirectory = fs.readdirSync('direflow-components');

  for (const directory of componentsDirectory) {
    if ((await stat(`direflow-components/${directory}`)).isDirectory()) {
      try {
        await exec(`cd direflow-components/${directory} && ../../node_modules/direflow-project/node_modules/yarn/bin/yarn test --watchAll=false`);
        console.log(chalk.greenBright(`Tests passed: ${directory}`));
      } catch (err) {
        console.log(chalk.red(`Tests failed: ${directory}`));
        console.log(err);
        process.exit(1);
      }
    }
  }
}

testAllComponents();
