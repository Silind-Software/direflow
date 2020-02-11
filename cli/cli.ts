import commander, { Command } from 'commander';
import chalk from 'chalk';
import { headline } from './headline';
import { createDireflowSetup } from './create';
import checkForUpdates from './checkForUpdate';
import { showVersion } from './messages';

type IOptions =
  | 'small'
  | 'js'
  | 'ts'
  | 'tslint'
  | 'eslint';

type TParsed = { [key in IOptions]?: true } & Command;

export const cli = () => {
  commander
    .command('create [project-name] [description]')
    .alias('c')
    .description('Create a new Direflow Setup')
    .option('--js', 'Choose JavaScript Direflow Template')
    .option('--ts', 'Choose TypeScript Direflow Template')
    .option('--tslint', 'Use TSLint for TypeScript Template')
    .option('--eslint', 'Use ESLint for TypeScript Template')
    .action((projectNames: string | undefined, description: string | undefined, parsed: TParsed) => {
      const { js, ts, tslint, eslint, args } = parsed;
      console.log({ projectNames, description, js, ts, tslint, eslint, args });
    });

  commander
    .description(chalk.magenta(headline))
    .version(showVersion())
    .helpOption('-h, --help', 'Show how to use direflow-cli')
    .option('-v, --version', 'Show the current version');

  const [, , simpleArg] = process.argv;

  if (!simpleArg) {
    return commander.help();
  }

  if (['-v', '--version'].includes(simpleArg)) {
    return console.log(checkForUpdates());
  }

  commander.parse(process.argv);
};
