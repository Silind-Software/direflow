import EventHooksPlugin from 'event-hooks-webpack-plugin';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import rimraf from 'rimraf';
import fs from 'fs';
import { resolve } from 'path';
import { PromiseTask } from 'event-hooks-webpack-plugin/lib/tasks';
import {
  TConfig,
  IOptions,
  IModule,
  IOptimization,
  IResolve,
  TEntry,
  IPlugin,
} from '../types/ConfigOverrides';

export = function override(config: TConfig, env: string, options?: IOptions) {
  const filename = options?.filename || 'direflowBundle.js';
  const chunkFilename = options?.chunkFilename || 'vendor.js';
  const entries = addEntries(config.entry, env);

  const overridenConfig = {
    ...config,
    entry: entries,
    module: overrideModule(config.module),
    output: overrideOutput(config.output, env, { filename, chunkFilename }),
    optimization: overrideOptimization(config.optimization, env),
    resolve: overrideResolve(config.resolve),
    plugins: overridePlugins(config.plugins, entries, env, { filename, chunkFilename }),
    externals: overrideExternals(config.externals, env),
  };

  return overridenConfig;
};

function addEntries(entry: TEntry, env: string) {
  const entryResolver = require('./dist/services/entryResolver').default;
  const originalEntry = [...(entry as string[])];

  const [pathIndex] = env === 'development' ? originalEntry.splice(1, 1) : originalEntry.splice(0, 1);
  const resolvedEntries = entryResolver(pathIndex);

  const newEntry: { [key: string]: string } = { main: pathIndex };

  originalEntry.forEach((path, index) => {
    newEntry[`path-${index}`] = path;
  });

  resolvedEntries.forEach((entries: { [key: string]: string }) => {
    Object.keys(entries).forEach((key) => {
      newEntry[key] = entries[key];
    });
  });

  const flatList = Object.values(newEntry);

  if (env === 'development') {
    return [...flatList, resolve(__dirname, './dist/config/welcome.js')];
  }

  if (hasOptions('split', env)) {
    return newEntry;
  }

  return flatList;
}

function overrideModule(module: IModule) {
  const cssRuleIndex = module.rules[2].oneOf.findIndex((rule) => '.css'.match(rule.test));
  const scssRuleIndex = module.rules[2].oneOf.findIndex((rule) => '.scss'.match(rule.test));

  if (cssRuleIndex !== -1) {
    module.rules[2].oneOf[cssRuleIndex].use = ['to-string-loader', 'css-loader'];
  }

  if (scssRuleIndex !== -1) {
    module.rules[2].oneOf[scssRuleIndex].use = ['to-string-loader', 'css-loader', 'sass-loader'];
  }

  module.rules[2].oneOf.unshift({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  return module;
}

function overrideOutput(
  output: IOptions,
  env: string,
  { filename, chunkFilename }: Required<IOptions>,
) {
  const outputFilename = hasOptions('split', env) ? '[name].js' : filename;

  return {
    ...output,
    filename: outputFilename,
    chunkFilename,
  };
}

function overrideOptimization(optimization: IOptimization, env: string) {
  optimization.minimizer[0].options.sourceMap = env === 'development';

  const vendorSplitChunks = {
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        chunks: 'initial',
        name: 'vendor',
        enforce: true,
      },
    },
  };

  return {
    ...optimization,
    splitChunks: hasOptions('vendor', env) ? vendorSplitChunks : false,
    runtimeChunk: false,
  };
}

function overridePlugins(plugins: IPlugin[], entry: TEntry, env: string, options: IOptions) {
  plugins[0].options.inject = 'head';

  plugins.push(
    new EventHooksPlugin({
      done: new PromiseTask(() => copyBundleScript(env, entry, options)),
    }),
  );

  plugins.push(
    new FilterWarningsPlugin({
      exclude: [
        /Module not found.*/,
        /Critical dependency: the request of a dependency is an expression/,
      ],
    }),
  );

  return plugins;
}

function overrideResolve(currentResolve: IResolve) {
  const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

  currentResolve.plugins = currentResolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin),
  );

  return currentResolve;
}

function overrideExternals(externals: { [key: string]: any }, env: string) {
  if (env === 'development') {
    return externals;
  }

  return {
    ...externals,
    react: 'React',
    'react-dom': 'ReactDOM',
  };
}

async function copyBundleScript(env: string, entry: TEntry, { filename, chunkFilename }: IOptions) {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  fs.readdirSync('build').forEach((file: string) => {
    if (file === filename) {
      return;
    }

    if (file === chunkFilename) {
      return;
    }

    if (!Array.isArray(entry) && Object.keys(entry).some((path) => `${path}.js` === file)) {
      return;
    }

    rimraf.sync(`build/${file}`);
  });
}

function hasOptions(flag: string, env: string) {
  if (env !== 'production') {
    return false;
  }

  if (process.argv.length < 3) {
    return false;
  }

  if (!process.argv.some((arg: string) => arg === `--${flag}` || arg === `-${flag[0]}`)) {
    return false;
  }

  return true;
}
