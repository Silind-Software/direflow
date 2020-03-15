import fs from 'fs';
import { resolve } from 'path';
import handlebars from 'handlebars';

function entryResolver(indexPath: string) {
  const paths = indexPath.split('/');
  const folderPath = [...paths].slice(0, paths.length - 1).join('/');

  const entryLoaderFile = fs.readFileSync(resolve(__dirname, '../template-scripts/entryLoader.js'), 'utf8');
  const componentFolders = fs.readdirSync(`${folderPath}/direflow-components`);

  const entryLoaderTemplate = handlebars.compile(entryLoaderFile);

  const entryList = componentFolders.map((folder) => {
    if (!fs.statSync(`${folderPath}/direflow-components/${folder}`).isDirectory()) {
      return null;
    }

    const pathIndex = `${folderPath}/direflow-components/${folder}/${paths[paths.length - 1]}`;

    if (!fs.existsSync(pathIndex)) {
      return null;
    }

    const entryFile = entryLoaderTemplate({ pathIndex });
    const entryLoaderPath = resolve(__dirname, `../${folder}.js`);

    fs.writeFileSync(entryLoaderPath, entryFile);
    return { [folder]: entryLoaderPath };
  }).filter(Boolean);

  return entryList;
}

export default entryResolver;
