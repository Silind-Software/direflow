const { ProvidePlugin } = require('webpack');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      }
    ],
  },

  plugins: [
    new ProvidePlugin({
      Promise: 'es6-promise-promise',
    })
  ]
};
