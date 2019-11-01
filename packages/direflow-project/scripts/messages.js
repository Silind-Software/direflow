const chalk = require('chalk');

const showDevServerMessage = () => {
console.log(
  `
  ${chalk.whiteBright('Direflow Project is running on a developer server')}
  You can view your Direflow Project in the browser.

  ${chalk.whiteBright('Local: ')}     http://localhost:${chalk.whiteBright(8000)}/
  `
  );
}

module.exports = {
  showDevServerMessage,
}
