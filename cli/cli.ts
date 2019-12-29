import program from 'commander';
import chalk from 'chalk';
import { headline } from './headline';
import { createProject, createDireflowSetup, create } from './create';
import checkForUpdates from './checkForUpdate';
import { showVersion } from './messages';

/**
 * CLI entrypoint
 */
export const cli = () => {
  program
    .command('create')
    .alias('c')
    .description('Create a new Direflow Setup')
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

  program.version(showVersion(), '-v, --version', 'Show the current version');
  program.helpOption('-h, --help', 'Show how to use direflow-cli');

  if (!process.argv.slice(2).length) {
    console.log('');
    program.help();
  }

  if (process.argv[2] === '-v' || process.argv[2] === '--version') {
    console.log(checkForUpdates());
  }

  program.parse(process.argv);
};
