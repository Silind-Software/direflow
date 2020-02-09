import program from 'commander';
import chalk from 'chalk';
import { headline } from './headline';
import { createDireflowSetup } from './create';
import checkForUpdates from './checkForUpdate';
import { showVersion } from './messages';

export const cli = () => {
  program
    .command('create')
    .alias('c')
    .description('Create a new Direflow Setup')
    .action(createDireflowSetup);

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
