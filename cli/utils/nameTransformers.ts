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
