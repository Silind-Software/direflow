import chalk from 'chalk';
import { execSync } from 'child_process';
import { updateAvailable } from './messages';

const checkForUpdates = () => {
  const rootPackage = require('../package.json');
  const buffer = execSync('npm view direflow-cli version');
  const currentVersion = buffer.toString('utf8');

  if (rootPackage.version.trim() !== currentVersion.trim()) {
    return chalk.white(updateAvailable(rootPackage.version.trim(), currentVersion.trim()));
  }

  return '';
};

export default checkForUpdates;
