import fs from 'fs';
import INames from '../interfaces/INames';

const packageJson = require('../../package.json');
const version = packageJson.version;

export const writeProjectNames = async (
  projectDirectoryPath: string,
  names: INames,
  description: string,
  type: string,
  packageVersion: string = version,
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
      await changeNameInfile(`${projectDirectoryPath}/${dirElement}`, new RegExp(/%install-version%/g), packageVersion);
    }
  });

  await Promise.all(writeNames);
};

const changeNameInfile = async (file: string, changeWhere: RegExp, changeTo: string) => {
  const changedFile = await new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        reject('Could not read file');
      }

      const changed = data.replace(changeWhere, changeTo);

      resolve(changed);
    });
  });

  await new Promise((resolve, reject) => {
    fs.writeFile(file, changedFile, 'utf-8', (err) => {
      if (err) {
        reject('Could not write file');
      }

      resolve();
    });
  });
};
