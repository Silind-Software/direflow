import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';
import chalk from 'chalk';
import { interupted, succeeded } from './helpers/messages';

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
  console.log('Building React component library...');
  let webpack: ChildProcess | undefined;

  if (args[0] === '--verbose') {
    webpack = spawn('webpack', ['--config', resolve(__dirname, '../webpack.config.js')], {
      shell: true,
      stdio: 'inherit',
    });
  } else {
    webpack = spawn('webpack', ['--config', resolve(__dirname, '../webpack.config.js')]);
  }

  webpack.stdout?.on('data', (data) => {
    if (data.toString().includes('ERROR')) {
      console.log(chalk.red('An error occured during the build!'));
      console.log(chalk.red(data.toString()));
    }
  });

  webpack.on('exit', (code: number) => {
    if (code !== 0) {
      console.log(interupted());
      return;
    }

    console.log(succeeded());
  });
}
