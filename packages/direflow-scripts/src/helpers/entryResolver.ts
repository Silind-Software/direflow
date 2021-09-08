import fs from 'fs';
import { resolve, join, sep } from 'path';
import handlebars from 'handlebars';
import { IOptions } from '../types/ConfigOverrides';

const DEFAULT_REACT = 'https://unpkg.com/react@17/umd/react.production.min.js';
const DEFAULT_REACT_DOM = 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js';

function entryResolver(indexPath: string, componentPath: string, { react, reactDOM }: IOptions) {
  const paths = indexPath.split(sep);
  const srcPath = [...paths].slice(0, paths.length - 1).join(sep);

  let reactResource: any = 'none';
  let reactDOMResource: any = 'none';

  if (react !== false) {
    reactResource = react || DEFAULT_REACT;
  }

  if (reactDOM !== false) {
    reactDOMResource = reactDOM || DEFAULT_REACT_DOM;
  }

  const entryLoaderFile = fs.readFileSync(
    resolve(__dirname, '../template-scripts/entryLoader.js'),
    'utf8',
  );
  const componentFolders = fs.readdirSync(join(srcPath, componentPath));

  const entryLoaderTemplate = handlebars.compile(entryLoaderFile);

  const mainEntryFile = entryLoaderTemplate({
    pathIndex: join(srcPath, paths[paths.length - 1]).replace(/\\/g, '\\\\'),
    reactResource,
    reactDOMResource,
  });
  const mainEntryLoaderPath = resolve(__dirname, '../main.js');
  fs.writeFileSync(mainEntryLoaderPath, mainEntryFile);

  const entryList = componentFolders
    .map((folder) => {
      if (!fs.statSync(join(srcPath, componentPath, folder)).isDirectory()) {
        return;
      }

      const pathIndex = join(srcPath, componentPath, folder, paths[paths.length - 1]);

      if (!fs.existsSync(pathIndex)) {
        return;
      }

      const escapedPathIndex = pathIndex.replace(/\\/g, '\\\\');

      const entryFile = entryLoaderTemplate({ pathIndex: escapedPathIndex, reactResource, reactDOMResource });
      const entryLoaderPath = resolve(__dirname, `../${folder}.js`);

      fs.writeFileSync(entryLoaderPath, entryFile);
      return { [folder]: entryLoaderPath };
    })
    .filter(Boolean);

  entryList.unshift({ main: mainEntryLoaderPath });

  return entryList as Array<{ [key: string]: string }>;
}

export default entryResolver;
