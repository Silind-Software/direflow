import fs from 'fs';

export const isDireflowSetup = (currentDirectory = process.cwd()): boolean => {
  return fs.existsSync(`${currentDirectory}/direflow-webpack.js`);
};
