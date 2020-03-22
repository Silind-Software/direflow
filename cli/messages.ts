import chalk from 'chalk';
import boxen from 'boxen';

export const componentFinishedMessage = (componentName: string) => `

  Your Direflow Component is ready!
  To get started:

    cd ${componentName}
    npm install
    npm start

  The Direflow Component will be running at: ${chalk.magenta('localhost:3000')}
`;

export const moreInfoMessage = `
  To learn more about Direflow, visit:
  https://direflow.io
`;

export const updateAvailable = (currentVersion: string, newVersion: string) => {
  const content = `There is a new version of direflow-cli available: ${chalk.greenBright(newVersion)}.
You are currently running direflow-cli version: ${chalk.blueBright(currentVersion)}.
Run '${chalk.magenta('npm i -g direflow-cli')}' to get the latest version.`;

  return boxen(content, { padding: 1, align: 'center', margin: 1 });
};

export const showVersion = () => {
  const packageJson = require('../package.json');
  return `Current version of direflow-cli:
  ${packageJson.version}
  `;
};
