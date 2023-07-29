import chalk from 'chalk';

export const interupted = () => `
  ${chalk.red('Build got interrupted.')}
  Did you remove the ${chalk.blue('src/component-exports')} file?

  Try building with the command ${chalk.blue('build:lib --verbose')}
`;

export const succeeded = () => `
  ${chalk.greenBright('Succesfully created React component library')}

  The ${chalk.blue('library')} folder can be found at ${chalk.green('/lib')}

  Alter your ${chalk.blue('package.json')} file by adding the field: 
  ${chalk.green('{ "main": "lib/component-exports.js" }')}

  ${chalk.blueBright('NB:')} If you are using hooks in your React components,
  you may need to move ${chalk.blue('react')} and ${chalk.blue('react-dom')}
  to ${chalk.blue('peerDependencies')}:
  ${chalk.green(
    `
  "peerDependencies": {
    "react": "17.0.2",
    "react-dom": "17.0.2"
  }`,
  )}

  You may publish the React component library with: ${chalk.blue('npm publish')}
`;
