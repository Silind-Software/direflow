import fs from 'fs';
import handelbars from 'handlebars';
import path from 'path';
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
    const filePath = path.join(projectDirectoryPath, dirElement);

    if (fs.statSync(filePath).isDirectory()) {
      return await writeProjectNames(filePath, names, description, type);
    }
    await changeNameInfile(filePath, { names, defaultDescription, type, packageVersion });
  });

  await Promise.all(writeNames)
    .catch(() => console.log('Failed to write files'));
};

const changeNameInfile = async (filePath: string, data: {}) => {
  const changedFile = await new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        reject();
      }

      const template = handelbars.compile(content);
      const changed = template(data);

      resolve(changed);
    });
  });

  await new Promise((resolve, reject) => {
    fs.writeFile(filePath, changedFile, 'utf-8', (err) => {
      if (err) {
        reject();
      }

      resolve();
    });
  });
};
