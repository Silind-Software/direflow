import EventHooksPlugin from 'event-hooks-webpack-plugin';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import rimraf from 'rimraf';
import fs from 'fs';
import { resolve } from 'path';
import { PromiseTask } from 'event-hooks-webpack-plugin/lib/tasks';

interface IOptions {
  filename?: string;
  chunkFilename?: string;
}

interface IModule {
  rules: {
    oneOf: {
      test: RegExp;
      use: string[];
    }[];
  }[];
}

interface IOutput {
  filename: string;
  chunkFilename: string;
}

interface IOptimization {
  minimizer: {
    options: {
      sourceMap: boolean;
    };
  }[];
  runtimeChunk: boolean;
  splitChunks: boolean | {
    cacheGroups: {
      vendor: {
        test: RegExp;
        chunks: string;
        name: string;
        enforce: boolean;
      };
    };
  };
}

interface IPlugin {
  options: {
    inject: string;
  };
}

interface IResolve {
  plugins: unknown[];
}

type TConfig = {
  [key: string]: unknown;
  entry: string[];
  module: IModule;
  output: IOutput;
  optimization: IOptimization;
  plugins: IPlugin[];
  resolve: IResolve;
};

export = function override(config: TConfig, env: string, options?: IOptions) {
  const filename = options?.filename || 'direflowBundle.js';
  const chunkFilename = options?.chunkFilename || 'vendor.js';

  const overridenConfig = {
    ...addWelcomeMessage(config, env),
    module: overrideModule(config.module),
    output: overrideOutput(config.output, { filename, chunkFilename }),
    optimization: overrideOptimization(config.optimization, env),
    resolve: overrideResolve(config.resolve),
    plugins: overridePlugins(config.plugins, env, { filename, chunkFilename }),
  };

  return overridenConfig;
};

function addWelcomeMessage(config: TConfig, env: string) {
  if (env === 'production') {
    return config;
  }

  const entry = [...config.entry];
  entry.push(resolve(__dirname, './dist/config/welcome.js'));
  config.entry = entry;

  return config;
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

function overrideOutput(output: IOptions, { filename, chunkFilename }: Required<IOptions>) {
  return {
    ...output,
    filename,
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
    splitChunks: shouldUseVendor(env) ? vendorSplitChunks : false,
    runtimeChunk: false,
  };
}

function overridePlugins(plugins: IPlugin[], env: string, options: IOptions) {
  plugins[0].options.inject = 'head';

  plugins.push(
    new EventHooksPlugin({
      done: new PromiseTask(() => copyBundleScript(env, options)),
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

async function copyBundleScript(env: string, { filename, chunkFilename }: IOptions) {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  fs.readdirSync('build').forEach((file: string) => {
    if (file !== filename && file !== chunkFilename) {
      rimraf.sync(`build/${file}`);
    }
  });
}

function shouldUseVendor(env: string) {
  if (env !== 'production') {
    return false;
  }

  if (process.argv.length < 3) {
    return false;
  }

  if (!process.argv.some((arg: string) => arg === '--vendor')) {
    return false;
  }

  return true;
}
