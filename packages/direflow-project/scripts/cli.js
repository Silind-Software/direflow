#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');
const { buildAllComponents } = require('../scripts/builds');
const { installAllComponents } = require('../scripts/installs');
const { testAllComponents } = require('../scripts/tests');
const { showDevServerMessage } = require('./messages');

if (process.argv[2] === 'start') {
  start();
}

if (process.argv[2] === 'build') {
  build();
}

if (process.argv[2] === 'install-all') {
  installAll();
}

if (process.argv[2] === 'build-all') {
  buildAll();
}

if (process.argv[2] === 'test-all') {
  testAll();
}

async function start() {
  await buildAll();

  const devServer = spawn('webpack-dev-server', [
    '--config',
    './node_modules/direflow-project/config/config.development.js',
  ]);

  console.log('');
  console.log(chalk.blueBright(`Starting Direflow Project at ${chalk.magenta('localhost:8000')}`));
  console.log('');

  let showFinishMessage;
  let messageIsShown = false;

  devServer.stdout.on('readable', () => {
    if (showFinishMessage) {
      clearTimeout(showFinishMessage);
    }

    showFinishMessage = setTimeout(() => {
      if (!messageIsShown) {
        showDevServerMessage();
        messageIsShown = true;
      }
    }, 1500);
  });

  devServer.stderr.on('readable', () => {
    console.log(chalk.red('Direflow Project failed to compile...'));
    process.exit(1);
  });
}

async function build() {
  await buildAll();

  const buildProcess = spawn('webpack', [
    '--config',
    './node_modules/direflow-project/config/config.production.js',
  ]);

  console.log('');
  console.log(chalk.blueBright('Creating production build ...'));
  console.log('');

  let showFinishMessage;
  let messageIsShown = false;

  buildProcess.stdout.on('readable', () => {
    if (showFinishMessage) {
      clearTimeout(showFinishMessage);
    }

    showFinishMessage = setTimeout(() => {
      if (!messageIsShown) {
        console.log(chalk.greenBright(`Build created: build/projectBundle.js`));
        messageIsShown = true;
      }
    }, 5000);
  });
}

async function installAll() {
  await installAllComponents();
}

async function buildAll() {
  await buildAllComponents();
}

async function testAll() {
  await testAllComponents();
}
