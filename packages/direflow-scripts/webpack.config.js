/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const { existsSync } = require('fs');
const { EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const srcPath = process.cwd();

const indexJsPath = `${srcPath}/src/component-exports.js`;
const indexTsPath = `${srcPath}/src/component-exports.ts`;

const existsIndexJs = existsSync(indexJsPath);
const existsIndexTs = existsSync(indexTsPath);

if (!existsIndexJs && !existsIndexTs) {
  throw Error('No component-exports.js or component-exports.ts file found');
}

const entryPath = existsIndexJs ? indexJsPath : indexTsPath;

const jsLoader = () => {
  if (!existsIndexJs) {
    return {};
  }

  return {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    },
  };
};

const tsLoder = () => {
  if (!existsIndexTs) {
    return {};
  }

  const writeTsConfig = require('./dist/helpers/writeTsConfig').default;
  writeTsConfig(srcPath);

  return {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: {
      configFile: resolve(__dirname, './tsconfig.lib.json'),
    },
  };
};

module.exports = {
  mode: 'production',
  devtool: 'none',
  entry: entryPath,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    alias: {
      react: resolve('../react'),
      reactDOM: resolve('../reactDOM'),
    },
  },
  output: {
    path: `${srcPath}/lib`,
    filename: 'component-exports.js',
    library: 'direflow-library',
    libraryTarget: 'commonjs2',
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
          module: true,
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
  module: {
    rules: [
      {
        ...jsLoader(),
      },
      {
        ...tsLoder(),
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'to-string-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'to-string-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [new EnvironmentPlugin({ NODE_ENV: 'production' }), new HashedModuleIdsPlugin()],
  externals: {
    'react': 'commonjs react',
    'react-dom': 'commonjs react-dom',
  },
};
