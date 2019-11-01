const EventHooksPlugin = require('event-hooks-webpack-plugin');
const { PromiseTask } = require('event-hooks-webpack-plugin/lib/tasks');
const rimraf = require('rimraf');
const fs = require('fs');
const { resolve } = require('path');

module.exports = function override(config, env) {
  const overridenConfig = {
    ...addWelcomeMessage(config, env),
    module: overrideModule(config.module),
    output: overrideOutput(config.output),
    optimization: overrideOptimization(config.optimization, env),
    plugins: overridePlugins(config.plugins, env),
  };

  return overridenConfig;
};

const addWelcomeMessage = (config, env) => { 
  if (env === 'production') {
    return config;
  }

  const entry = [...config.entry];
  entry.push(resolve(__dirname, './config/welcome.js'));

  config.entry = entry;

  return config;
}

const overrideModule = (module) => {
  const cssRuleIndex = module.rules[2].oneOf.findIndex((rule) => '.css'.match(rule.test));
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

const overrideOutput = (output) => {
  const { checkFilename, ...newOutput } = output;

  return {
    ...newOutput,
    filename: 'componentBundle.js',
  };
};

const overrideOptimization = (optimization, env) => {
  const newOptions = optimization.minimizer[0].options;

  newOptions.sourceMap = env === 'development';
  optimization.minimizer[0].options = newOptions;

  return {
    ...optimization,
    splitChunks: false,
    runtimeChunk: false,
  };
};

const overridePlugins = (plugins, env) => {
  plugins[0].options.inject = 'head';

  plugins.push(
    new EventHooksPlugin({
      done: new PromiseTask(() => copyBundleScript(env)),
    }),
  );

  return plugins;
};

const copyBundleScript = async (env) => {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  fs.readdirSync('build').forEach((file) => {
    if (file !== 'componentBundle.js') {
      rimraf.sync(`build/${file}`);
    }
  });
};
