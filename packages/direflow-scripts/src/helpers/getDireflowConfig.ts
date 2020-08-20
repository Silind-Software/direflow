import fs from 'fs';
import { sep } from 'path';
import IDireflowConfig from '../types/DireflowConfig';

const getDireflowConfig = (indexPath: string) => {
  try {
    const paths = indexPath.split(sep);
    const rootPath = [...paths].slice(0, paths.length - 2).join(sep);

    const config = fs.readFileSync(`${rootPath}/direflow-config.json`, 'utf8');

    if (!config) {
      throw Error();
    }

    return JSON.parse(config) as IDireflowConfig;
  } catch (error) { /* Suppress error */ }
};

export default getDireflowConfig;
