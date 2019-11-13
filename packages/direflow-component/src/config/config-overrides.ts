import EventHooksPlugin from 'event-hooks-webpack-plugin';
import HtmlWebpackExternalsPlugin from 'html-webpack-externals-plugin';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import rimraf from 'rimraf';
import fs from 'fs';
import { resolve } from 'path';
import { PromiseTask } from 'event-hooks-webpack-plugin/lib/tasks';

module.exports = function override(config: any, env: any): any {
  const overridenConfig = {
    ...addWelcomeMessage(config, env),
    module: overrideModule(config.module),
    output: overrideOutput(config.output),
    optimization: overrideOptimization(config.optimization, env),
    plugins: overridePlugins(config.plugins, env),
  };

  return overridenConfig;
};

const addWelcomeMessage = (config: any, env: any) => {
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
    filename: 'componentBundle.js',
  };
};

const overrideOptimization = (optimization: any, env: any) => {
  const newOptions = optimization.minimizer[0].options;

  newOptions.sourceMap = env === 'development';
  optimization.minimizer[0].options = newOptions;

  return {
    ...optimization,
    splitChunks: false,
    runtimeChunk: false,
  };
};

const overridePlugins = (plugins: any, env: any) => {
  plugins[0].options.inject = 'head';

  plugins.push(
    new EventHooksPlugin({
      done: new PromiseTask(() => copyBundleScript(env)),
    }),
  );

  plugins.push(
    new FilterWarningsPlugin({
      exclude: [/Module not found.*/, /Critical dependency: the request of a dependency is an expression/],
    }),
  );

  const customScripts = getCustomScripts();
  if (customScripts) {
    plugins.push(
      new HtmlWebpackExternalsPlugin({
        externals: customScripts,
      }),
    );
  }

  return plugins;
};

const copyBundleScript = async (env: any) => {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  fs.readdirSync('build').forEach((file: string) => {
    if (file !== 'componentBundle.js') {
      rimraf.sync(`build/${file}`);
    }
  });
};

const getCustomScripts = () => {
  const { getDireflowPlugin } = require('./dist/utils/direflowConfigExtrator');
  const plugin = getDireflowPlugin('script-loader');

  if (!plugin) {
    return;
  }

  if (plugin.options.externals && plugin.options.externals.length) {
    return plugin.options.externals;
  }
};
