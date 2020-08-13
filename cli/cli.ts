import commander, { Command } from 'commander';
import chalk from 'chalk';
import headline from './headline';
import { createDireflowSetup } from './create';
import checkForUpdates from './checkForUpdate';
import { showVersion } from './messages';

type TOptions =
  | 'small'
  | 'js'
  | 'ts'
  | 'tslint'
  | 'eslint'
  | 'npm';

type TParsed = Command & { [key in TOptions]?: true } & { desc: string };

export default function cli() {
  commander
    .command('create [project-name]')
    .alias('c')
    .description('Create a new Direflow Setup')
    .option('-d, --desc <description>', 'Choose description for your project')
    .option('--js', 'Choose JavaScript Direflow template')
    .option('--ts', 'Choose TypeScript Direflow template')
    .option('--tslint', 'Use TSLint for TypeScript template')
    .option('--eslint', 'Use ESLint for TypeScript template')
    .option('--npm', 'Make the project an NPM module')
    .action(handleAction);

  commander
    .description(chalk.magenta(headline))
    .version(showVersion())
    .helpOption('-h, --help', 'Show how to use direflow-cli');

  const [, , simpleArg] = process.argv;

  if (!simpleArg) {
    return commander.help();
  }

  if (['-v', '--version'].includes(simpleArg)) {
    console.log(checkForUpdates());
  }

  commander.parse(process.argv);
}

async function handleAction(name: string | undefined, parsed: TParsed) {
  const { js, ts, tslint, eslint, npm, desc: description } = parsed;

  let language: 'js' | 'ts' | undefined;
  let linter: 'eslint' | 'tslint' | undefined;

  if (js) {
    language = 'js';
  } else if (ts) {
    language = 'ts';
  }

  if (eslint) {
    linter = 'eslint';
  } else if (tslint) {
    linter = 'tslint';
  }

  await createDireflowSetup({
    name,
    linter,
    language,
    description,
    npmModule: !!npm,
  }).catch((err) => {
    console.log('');
    console.log(chalk.red('Unfortunately, something went wrong creating your Direflow Component'));
    console.log(err);
    console.log('');
  });
}
