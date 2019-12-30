import EventHooksPlugin from 'event-hooks-webpack-plugin';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import rimraf from 'rimraf';
import fs from 'fs';
import { resolve } from 'path';
import { PromiseTask } from 'event-hooks-webpack-plugin/lib/tasks';

module.exports = function override(config: any, env: string): any {
  const overridenConfig = {
    ...addWelcomeMessage(config, env),
    module: overrideModule(config.module),
    output: overrideOutput(config.output),
    optimization: overrideOptimization(config.optimization, env),
    resolve: overrideResolve(config.resolve),
    plugins: overridePlugins(config.plugins, env),
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
    module.rules[2].oneOf[cssRuleIndex].use[0] = {
      loader: 'to-string-loader',
    };
    module.rules[2].oneOf[cssRuleIndex].use[1] = {
      loader: 'css-loader',
    };
  }

  if (scssRuleIndex !== -1) {
    module.rules[2].oneOf[scssRuleIndex].use[0] = {
      loader: 'to-string-loader',
    };
    module.rules[2].oneOf[cssRuleIndex].use[1] = {
      loader: 'css-loader',
    };
    module.rules[2].oneOf[scssRuleIndex].use[2] = {
      loader: 'sass-loader',
    };
  }

  module.rules[2].oneOf.unshift({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  return module;
};

const overrideOutput = (output: any) => {
  const { checkFilename, ...newOutput } = output;

  return {
    ...newOutput,
    filename: 'direflowBundle.js',
    chunkFilename: 'vendor.js',
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

const overridePlugins = (plugins: any, env: string) => {
  plugins[0].options.inject = 'head';

  plugins.push(
    new EventHooksPlugin({
      done: new PromiseTask(() => copyBundleScript(env)),
    })
  );

  plugins.push(
    new FilterWarningsPlugin({
      exclude: [/Module not found.*/, /Critical dependency: the request of a dependency is an expression/],
    })
  );

  return plugins;
};

const overrideResolve = (resolve: any) => {
  const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
  const filteredPlugins = resolve.plugins.filter((plugin: any) => !(plugin instanceof ModuleScopePlugin));

  resolve.plugins = filteredPlugins;

  return resolve;
};

const copyBundleScript = async (env: string) => {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  fs.readdirSync('build').forEach((file: string) => {
    if (file !== 'direflowBundle.js' && file !== 'vendor.js') {
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
