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

export = function override(config: TConfig, env: string, options?: IOptions) {
  const originalEntry = [...(config.entry as string[])];
  const [pathIndex] =
    env === 'development' ? originalEntry.splice(1, 1) : originalEntry.splice(0, 1);

  /**
   * TODO: Remove deprecated options
   */
  const direflowConfig = setDeprecatedOptions(
    // Set deprecated options on config
    env,
    getDireflowConfig(pathIndex),
    options,
  );

  const entries = addEntries(config.entry, pathIndex, env, direflowConfig);

  const overridenConfig = {
    ...config,
    entry: entries,
    module: overrideModule(config.module),
    output: overrideOutput(config.output, direflowConfig),
    optimization: overrideOptimization(config.optimization, env, direflowConfig),
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

function overrideOptimization(optimization: IOptimization, env: string, config?: IDireflowConfig) {
  optimization.minimizer[0].options.sourceMap = env === 'development';
  const useVendor = config?.build?.vendor;

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

/**
 * TODO: This function should be removed in next minor version
 * @deprecated
 * @param flag
 * @param env
 */
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

/**
 * TODO: This function should be removed in next minor version
 * @deprecated
 * @param config
 * @param options
 */
function setDeprecatedOptions(env: string, config?: IDireflowConfig, options?: IOptions) {
  if (!options) {
    return config;
  }

  const newObj = config ? (JSON.parse(JSON.stringify(config)) as IDireflowConfig) : {};
  const { filename, chunkFilename, react, reactDOM } = options;

  const useSplit = hasOptions('split', env);
  const useVendor = hasOptions('vendor', env);

  if (filename && !newObj.build?.filename) {
    if (!newObj.build) {
      newObj.build = { filename };
    } else {
      newObj.build.filename = filename;
    }
  }

  if (chunkFilename && !newObj.build?.chunkFilename) {
    if (!newObj.build) {
      newObj.build = { chunkFilename };
    } else {
      newObj.build.chunkFilename = chunkFilename;
    }
  }

  if (useSplit && !newObj.build?.split) {
    if (!newObj.build) {
      newObj.build = { split: useSplit };
    } else {
      newObj.build.split = useSplit;
    }
  }

  if (useVendor && !newObj.build?.vendor) {
    if (!newObj.build) {
      newObj.build = { vendor: useVendor };
    } else {
      newObj.build.vendor = useVendor;
    }
  }

  if (react && !newObj.modules?.react) {
    if (!newObj.modules) {
      newObj.modules = { react } as { react: string };
    } else {
      newObj.modules.react = react as string;
    }
  }

  if (reactDOM && !newObj.modules?.reactDOM) {
    if (!newObj.modules) {
      newObj.modules = { reactDOM } as { reactDOM: string };
    } else {
      newObj.modules.reactDOM = reactDOM as string;
    }
  }

  return newObj;
}
