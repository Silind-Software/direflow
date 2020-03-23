import { spawn } from 'child_process';
import { resolve } from 'path';
import chalk from 'chalk';

type TCommand = 'start' | 'test' | 'build' | 'build:lib';

export default function cli(args: Array<TCommand | string>) {
  const [command, ...restArgs] = args;

  switch (command as TCommand) {
    case 'start':
      start();
      break;
    case 'test':
      test();
      break;
    case 'build':
      build(restArgs);
      break;
    case 'build:lib':
      buildLib(restArgs);
      break;
    default:
      console.log('No arguments provided.');
  }
}

function start() {
  spawn('react-app-rewired', ['start'], { shell: true, stdio: 'inherit' });
}

function test() {
  spawn('react-app-rewired', ['test', '--env=jest-environment-jsdom-fourteen'], {
    shell: true,
    stdio: 'inherit',
  });
}

function build(args: string[]) {
  spawn('react-app-rewired', ['build', ...args], { shell: true, stdio: 'inherit' });
}

function buildLib(args: string[]) {
  const options: any = args[0] === '--verbose'
    ? { shell: true, stdio: 'inherit' }
    : undefined;

  console.log('Building React component library...');
  const webpack = spawn('webpack', ['--config', resolve(__dirname, '../webpack.config.js')], options);

  webpack.stdout.on('data', (data) => {
    if (data.toString().includes('ERROR')) {
      console.log(chalk.red('An error occured during the build!'));
      console.log(chalk.red(data.toString()));
    }
  });

  webpack.on('exit', (code: number) => {
    if (code !== 0) {
      console.log('');
      console.log(chalk.red('Build got interrupted.'));
      console.log(`Did you remove the ${chalk.blue('src/component-exports')} file?`);
      console.log('');
      console.log(`Try building with the command ${chalk.blue('build:lib --verbose')}`);
      console.log('');
      return;
    }

    console.log('');
    console.log(chalk.greenBright('Succesfully create React component library'));
    console.log('');
    console.log(`The ${chalk.blue('library')} folder can be found at ${chalk.green('/lib')}`);
    console.log('');
    console.log(
      `Alter your ${chalk.blue('package.json')} file by adding the field: ${chalk.green(
        '{ "main": "lib/index.js" }',
      )}`,
    );
    console.log(`You may publish the React component library with: ${chalk.blue('npm publish')}`);
    console.log('');
  });
}
