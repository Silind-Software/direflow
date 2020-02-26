import fs from 'fs';
import handelbars from 'handlebars';
import path from 'path';
import { INames } from '../types/Names';

const packageJson = require('../../package.json');

const { version } = packageJson;

interface IWriteNameOptions {
  projectDirectoryPath: string;
  linter: 'eslint' | 'tslint';
  packageVersion?: string;
  description: string;
  names: INames;
  type: string;
}

const writeProjectNames = async ({
  type,
  names,
  description,
  linter,
  projectDirectoryPath,
  packageVersion = version,
}: IWriteNameOptions): Promise<void> => {
  const projectDirectory = fs.readdirSync(projectDirectoryPath);
  const defaultDescription = description || 'This project is created using Direflow';

  const writeNames = projectDirectory.map(async (dirElement: string) => {
    const filePath = path.join(projectDirectoryPath, dirElement);

    if (fs.statSync(filePath).isDirectory()) {
      return writeProjectNames({
        names,
        description,
        type,
        linter,
        projectDirectoryPath: filePath,
      });
    }

    if (linter !== 'tslint') {
      if (filePath.endsWith('tslint.json')) {
        return fs.unlinkSync(filePath);
      }
    }

    if (linter !== 'eslint') {
      if (filePath.endsWith('.eslintrc')) {
        return fs.unlinkSync(filePath);
      }
    }

    await changeNameInfile(filePath, {
      names,
      defaultDescription,
      type,
      packageVersion,
      eslint: linter === 'eslint',
      tslint: linter === 'tslint',
    });
  });

  await Promise.all(writeNames).catch(() => console.log('Failed to write files'));
};

const changeNameInfile = async (filePath: string, data: {}): Promise<void> => {
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

export default writeProjectNames;
