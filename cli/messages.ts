import chalk from 'chalk';

export const projectFinishedMessage = (projectName: string) => `

  Your Direflow Project is ready!
  To get started:

    cd ${projectName}
    yarn install

  Then you can create your first component:

    direflow create --component
`;

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
