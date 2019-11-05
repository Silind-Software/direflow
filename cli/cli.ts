import program from 'commander';
import chalk from 'chalk';
import { headline } from './headline';
import { createProject, createComponent, create } from './create';

const packageJson = require('../package.json');

/**
 * CLI entrypoint
 */
export const cli = () => {
  program
    .command('create')
    .alias('c')
    .description('Create a new Direflow Project or Direflow Component')
    .option('-p, --project', 'Create a new Direflow Project')
    .option('-c, --component', 'Create a new Direflow Component')
    .action((args: any) => {
      if (args.project) {
        createProject();
      } else if (args.component) {
        createComponent();
      } else {
        create();
      }
    });

  program.description(chalk.magenta(headline));

  const versionMessage = `
  Current version of direflow-cli:
  ${packageJson.version}
  `;

  program.version(versionMessage, '-v, --version', 'Show the current version');

  if (!process.argv.slice(2).length) {
    console.log('');
    program.help();
    return;
  }

  program.parse(process.argv);
};
