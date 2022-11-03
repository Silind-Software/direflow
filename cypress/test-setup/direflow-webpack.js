const { webpackConfig } = require('direflow-scripts');
const { aliasWebpack } = require("react-app-alias");

/**
 * Webpack configuration for Direflow Component
 * Additional webpack plugins / overrides can be provided here
 */
module.exports = (config, env) => {
  let useWebpackConfig = {
    ...webpackConfig(config, env),
    // Add your own webpack config here (optional)
  };
  useWebpackConfig = aliasWebpack({})(useWebpackConfig);
  return useWebpackConfig;
};
