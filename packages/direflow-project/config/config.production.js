const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');
const { EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const webpackConfig = require('./webpack.config');
const customWebpackConfig = require('../../../direflow-webpack.js');
const componentRegistrations = require('./componentRegistrations.json');

module.exports = merge(webpackConfig, customWebpackConfig, {
  mode: 'production',
  devtool: 'none',

  entry: {
    'projectBundle': [
      resolve(__dirname, './registerDireflowComponents.js'),
      resolve(__dirname, '../../../src/index.ts'),
      ...componentRegistrations.map((component) => resolve(__dirname, `../../../${component.path}/${component.bundle}`))
    ]
  },

  output: {
    path: resolve(__dirname, '../../../build'),
    filename: 'projectBundle.js',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 5,
          warnings: false,
          parse: {},
          compress: {
            toplevel: true,
            unused: true,
            dead_code: true,
            drop_console: true,
          },
          mangle: true,
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
    runtimeChunk: false,
  },

  performance: {
    hints: false,
  },

  plugins: [
    new EnvironmentPlugin({ NODE_ENV: 'production' }),
    new HashedModuleIdsPlugin(),
  ],
});
