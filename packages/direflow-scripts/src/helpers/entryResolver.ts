import fs from 'fs';
import { resolve, join, sep } from 'path';
import handlebars from 'handlebars';
import { IOptions } from '../types/ConfigOverrides';

const DEFAULT_REACT = 'https://unpkg.com/react@16/umd/react.production.min.js';
const DEFAULT_REACT_DOM = 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js';

function entryResolver(indexPath: string, { react, reactDOM }: IOptions) {
  const paths = indexPath.split(sep);
  const folderPath = [...paths].slice(0, paths.length - 1).join(sep);

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
  const componentFolders = fs.readdirSync(join(folderPath, 'direflow-components'));

  const entryLoaderTemplate = handlebars.compile(entryLoaderFile);

  const mainEntryFile = entryLoaderTemplate({
    pathIndex: join(folderPath, paths[paths.length - 1]),
    reactResource,
    reactDOMResource,
  });
  const mainEntryLoaderPath = resolve(__dirname, '../main.js');
  fs.writeFileSync(mainEntryLoaderPath, mainEntryFile);

  const entryList = componentFolders
    .map((folder) => {
      if (!fs.statSync(join(folderPath, 'direflow-components', folder)).isDirectory()) {
        return;
      }

      const pathIndex = join(folderPath, 'direflow-components', folder, paths[paths.length - 1]);

      if (!fs.existsSync(pathIndex)) {
        return;
      }

      const entryFile = entryLoaderTemplate({ pathIndex, reactResource, reactDOMResource });
      const entryLoaderPath = resolve(__dirname, `../${folder}.js`);

      fs.writeFileSync(entryLoaderPath, entryFile);
      return { [folder]: entryLoaderPath };
    })
    .filter(Boolean);

  entryList.unshift({ main: mainEntryLoaderPath });

  return entryList as Array<{ [key: string]: string }>;
}

export default entryResolver;
