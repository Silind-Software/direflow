const merge = require('webpack-merge');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = require('./webpack.config');
const customWebpackConfig = require('../../../direflow-webpack.js');
const componentRegistrations = require('./componentRegistrations.json');

module.exports = merge(webpackConfig, customWebpackConfig, {
  entry: {
    projectBundle: [
      resolve(__dirname, './registerDireflowComponents.js'),
      resolve(__dirname, './welcome.js'),
      resolve(__dirname, './defaultHtml.js'),
      resolve(__dirname, '../../../src/index.ts'),
      ...componentRegistrations.map((component) => resolve(__dirname, `../../../${component.path}/${component.bundle}`)),
    ],
  },

  devServer: {
    port: 8000,
    open: true,
    clientLogLevel: 'silent',
  },
  
  mode: 'development',

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Direflow Project',
      template: './public/index.html',
      inject: 'head',
    }),
  ],

});
