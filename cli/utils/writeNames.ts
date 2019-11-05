import fs from 'fs';
import INames from '../interfaces/INames';
import { changeNameInfile } from './utils';

const packageJson = require('../../package.json');
const version = packageJson.version;

export const writeProjectNames = async (
  projectDirectoryPath: string,
  names: INames,
  description: string,
  type: string,
): Promise<void> => {
  const projectDirectory = fs.readdirSync(projectDirectoryPath);
  const defaultDescription = description || 'This project is created using Direflow';

  const writeNames = projectDirectory.map(async (dirElement: string) => {
    if (fs.statSync(`${projectDirectoryPath}/${dirElement}`).isDirectory()) {
      await writeProjectNames(`${projectDirectoryPath}/${dirElement}`, names, description, type);
    } else {
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%name-title%/g), names.title);
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%name-snake%/g), names.snake);
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%name-pascal%/g), names.pascal);
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%description%/g), defaultDescription);
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%setup-type%/g), type);
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%install-version%/g), version);
    }
  });

  await Promise.all(writeNames);
};
