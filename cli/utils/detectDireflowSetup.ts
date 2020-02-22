import fs from 'fs';

const isDireflowSetup = (currentDirectory = process.cwd()): boolean => {
  return fs.existsSync(`${currentDirectory}/direflow-webpack.js`);
};

export default isDireflowSetup;
