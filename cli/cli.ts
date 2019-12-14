import program from 'commander';
import chalk from 'chalk';
import { headline } from './headline';
import { createProject, createDireflowSetup, create } from './create';
import checkForUpdates from './checkForUpdate';

const packageJson = require('../package.json');

/**
 * CLI entrypoint
 */
export const cli = () => {
  program
    .command('create')
    .alias('c')
    .description('Create a new Direflow Project or Direflow Component')
    .option('-p, --project', 'Deprecated: Create a new Direflow Project')
    .option('-c, --component', 'Create a new Direflow Component')
    .action((args: any) => {
      if (args.project) {
        createProject();
      } else if (args.component) {
        createDireflowSetup();
      } else {
        create();
      }
    });

  program.description(chalk.magenta(headline));

  const versionMessage = `
    ${checkForUpdates()}
    Current version of direflow-cli:
    ${packageJson.version}
  `;

  program.version(versionMessage, '-v, --version', 'Show the current version');

  if (!process.argv.slice(2).length) {
    console.log('');
    program.help();
  }

  program.parse(process.argv);
};
