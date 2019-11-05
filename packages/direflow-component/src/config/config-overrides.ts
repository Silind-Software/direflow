const EventHooksPlugin = require('event-hooks-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const { PromiseTask } = require('event-hooks-webpack-plugin/lib/tasks');
const rimraf = require('rimraf');
const fs = require('fs');
const { resolve } = require('path');

const getComponentConfig = () => {
  try {
    const componentConfig = require('../../direflow-config');
    return componentConfig;
  } catch (err) {
    console.warn('direflow-config.js cannot be found.');
  }
}

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
  if (cssRuleIndex !== -1) {
    module.rules[2].oneOf[cssRuleIndex].use[0] = {
      loader: 'to-string-loader',
    };
    module.rules[2].oneOf[cssRuleIndex].use[1] = {
      loader: 'css-loader',
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
  const componentConfig = getComponentConfig();

  if (!componentConfig) {
    return;
  }

  if (!componentConfig.plugins || !componentConfig.plugins.length) {
    return;
  }

  const scriptLoaderPlugin = componentConfig.plugins.find((plugin: any) => plugin.name === 'script-loader');

  if (scriptLoaderPlugin && scriptLoaderPlugin.options.externals.length) {
    return scriptLoaderPlugin.options.externals;
  }
};
