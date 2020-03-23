import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

async function writeTsConfig(srcPath: string) {
  if (existsSync(resolve(__dirname, '../../tsconfig.lib.json'))) {
    return;
  }

  const tsConfig = {
    extends: `${srcPath}/tsconfig.json`,
    compilerOptions: {
      module: 'esnext',
      noEmit: false,
      outDir: `${srcPath}/lib`,
      declaration: true,
      lib: ['es6', 'dom', 'es2016', 'es2017'],
    },
  };

  writeFileSync(resolve(__dirname, '../../tsconfig.lib.json'), JSON.stringify(tsConfig, null, 2));
}

export default writeTsConfig;
