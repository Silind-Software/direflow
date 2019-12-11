import fs from 'fs';
import INames from '../interfaces/INames';

export const toTitleFormat = (name: string) => {
  if (name.includes('-')) {
    const wordList = name.split('-');
    const capitalized = wordList.map((w) => {
      return w.charAt(0).toUpperCase() + w.slice(1);
    });

    return capitalized.join(' ');
  }

  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return capitalized.replace(/([A-Z])/g, ' $1').trim();
};

export const toSnakeCase = (name: string) => {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const snaked = capitalized.replace(/([A-Z])/g, '-$1').slice(1);
  return snaked.toLowerCase();
};

export const toPascalCase = (name: string) => {
  const wordList = name.split('-');
  const capitalized = wordList.map((w) => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return capitalized.join('');
};

export const changeNameInfile = async (file: string, changeWhere: RegExp, changeTo: string) => {
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

export const getNameFormats = (name: string): INames => {
  return {
    title: toTitleFormat(name),
    pascal: toPascalCase(name),
    snake: toSnakeCase(name),
  };
};

export const createDefaultName = (name: string) => {
  const snakeName = toSnakeCase(name);

  if (!snakeName.includes('-')) {
    return `${snakeName}-component`;
  }

  return snakeName;
};

export const isDireflowSetup = (): boolean => {
  const currentDirectory = process.cwd();
  if (!fs.existsSync(`${currentDirectory}/direflow-config.js`)) {
    return false;
  }

  const spec = require(`${currentDirectory}/direflow-config.js`);

  return spec.direflowMetadata && spec.direflowMetadata.type && spec.direflowMetadata.type === 'direflow-component';
};
