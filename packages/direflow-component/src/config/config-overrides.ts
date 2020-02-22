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

export = function override(config: any, env: string, options?: IOptions): any {
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

const addWelcomeMessage = (config: any, env: string) => {
  if (env === 'production') {
    return config;
  }

  const entry = [...config.entry];
  entry.push(resolve(__dirname, './dist/config/welcome.js'));

  config.entry = entry;

  return config;
};

const overrideModule = (module: any) => {
  const cssRuleIndex = module.rules[2].oneOf.findIndex((rule: any) => '.css'.match(rule.test));
  const scssRuleIndex = module.rules[2].oneOf.findIndex((rule: any) => '.scss'.match(rule.test));

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
};

const overrideOutput = (output: any, { filename, chunkFilename }: IOptions) => {
  const { checkFilename, ...newOutput } = output;

  return {
    ...newOutput,
    filename,
    chunkFilename,
  };
};

const overrideOptimization = (optimization: any, env: string) => {
  const newOptions = optimization.minimizer[0].options;
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

  newOptions.sourceMap = env === 'development';
  optimization.minimizer[0].options = newOptions;

  return {
    ...optimization,
    splitChunks: shouldUseVendor(env) ? vendorSplitChunks : false,
    runtimeChunk: false,
  };
};

const overridePlugins = (plugins: any, env: string, options: IOptions) => {
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
};

const overrideResolve = (currentResolve: any) => {
  const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
  const filteredPlugins = currentResolve.plugins.filter(
    (plugin: any) => !(plugin instanceof ModuleScopePlugin),
  );

  currentResolve.plugins = filteredPlugins;

  return currentResolve;
};

const copyBundleScript = async (env: string, { filename, chunkFilename }: IOptions) => {
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
};

const shouldUseVendor = (env: string) => {
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
};
