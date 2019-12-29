import chalk from 'chalk';
import boxen from 'boxen';

export const componentFinishedMessage = (componentName: string) => `

  Your Direflow Component is ready!
  To get started:

    cd ${componentName}
    yarn install
    yarn start

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

export const projectDeprecated = () => {
  const content = `${chalk.red('The "Direflow Project" feature has been deprecated.')}
Use '${chalk.magenta('direflow create')}' to create a new Direflow Setup.
You can now create multiple instances of Direflow Components.

Read more on ${chalk.blueBright('https://direflow.io/get-started#multiple-web-components')}`;

  return boxen(content, { padding: 1, align: 'center', margin: 1 });
};

export const showVersion = () => {
  const packageJson = require('../package.json');
  return `
  Current version of direflow-cli:
  ${packageJson.version}
  `;
};
