import EventHooksPlugin from 'event-hooks-webpack-plugin';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import rimraf from 'rimraf';
import fs from 'fs';
import { resolve } from 'path';
import { PromiseTask } from 'event-hooks-webpack-plugin/lib/tasks';
import entryResolver from '../helpers/entryResolver';
import {
  TConfig,
  IOptions,
  IModule,
  IOptimization,
  IResolve,
  TEntry,
  IPlugin,
} from '../types/ConfigOverrides';
import getDireflowConfig from '../helpers/getDireflowConfig';
import IDireflowConfig from '../types/DireflowConfig';

export = function override(config: TConfig, env: string) {
  const originalEntry = [...(config.entry as string[])];
  const [pathIndex] =
    env === 'development' ? originalEntry.splice(1, 1) : originalEntry.splice(0, 1);

  const direflowConfig = getDireflowConfig(pathIndex);

  const useVendor = !!direflowConfig?.build?.vendor;

  const entries = addEntries(config.entry, pathIndex, env, direflowConfig);

  const overridenConfig = {
    ...config,
    entry: entries,
    module: overrideModule(config.module),
    output: overrideOutput(config.output, direflowConfig),
    optimization: overrideOptimization(config.optimization, env, useVendor),
    resolve: overrideResolve(config.resolve),
    plugins: overridePlugins(config.plugins, entries, env, direflowConfig),
    externals: overrideExternals(config.externals, env, direflowConfig),
  };

  return overridenConfig;
};

function addEntries(entry: TEntry, pathIndex: string, env: string, config?: IDireflowConfig) {
  const originalEntry = [...(entry as string[])];

  const react = config?.modules?.react;
  const reactDOM = config?.modules?.reactDOM;
  const useSplit = !!config?.build?.split;

  const resolvedEntries = entryResolver(pathIndex, { react, reactDOM });

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
    return [...flatList, resolve(__dirname, '../template-scripts/welcome.js')];
  }

  if (useSplit) {
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

function overrideOutput(output: IOptions, config?: IDireflowConfig) {
  const useSplit = config?.build?.split;
  const filename = config?.build?.filename || 'direflowBundle.js';
  const chunkFilename = config?.build?.chunkFilename || 'vendor.js';

  const outputFilename = useSplit ? '[name].js' : filename;

  return {
    ...output,
    filename: outputFilename,
    chunkFilename,
  };
}

function overrideOptimization(optimization: IOptimization, env: string, useVendor: boolean) {
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
    splitChunks: useVendor ? vendorSplitChunks : false,
    runtimeChunk: false,
  };
}

function overridePlugins(plugins: IPlugin[], entry: TEntry, env: string, config?: IDireflowConfig) {
  plugins[0].options.inject = 'head';

  plugins.push(
    new EventHooksPlugin({
      done: new PromiseTask(() => copyBundleScript(env, entry, config)),
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
  try {
    const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

    currentResolve.plugins = currentResolve.plugins.filter(
      (plugin) => !(plugin instanceof ModuleScopePlugin),
    );
  } catch (error) {
    // supress error
  }

  return currentResolve;
}

function overrideExternals(
  externals: { [key: string]: any },
  env: string,
  config?: IDireflowConfig,
) {
  if (env === 'development') {
    return externals;
  }

  const extraExternals: any = { ...externals };
  const react = config?.modules?.react;
  const reactDOM = config?.modules?.reactDOM;

  if (react) {
    extraExternals.react = 'React';
  }

  if (reactDOM) {
    extraExternals['react-dom'] = 'ReactDOM';
  }

  return extraExternals;
}

async function copyBundleScript(env: string, entry: TEntry, config?: IDireflowConfig) {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  const filename = config?.build?.filename || 'direflowBundle.js';
  const chunkFilename = config?.build?.chunkFilename || 'vendor.js';
  const emitAll = config?.build?.emitAll;
  const emitSourceMaps = config?.build?.emitSourceMap;
  const emitIndexHTML = config?.build?.emitIndexHTML;

  if (emitAll) {
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

    if (emitSourceMaps && file.endsWith('.map')) {
      return;
    }

    if (emitIndexHTML && file.endsWith('.html')) {
      return;
    }

    rimraf.sync(`build/${file}`);
  });
}
