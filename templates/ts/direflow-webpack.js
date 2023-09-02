const { webpackConfig } = require('direflow-scripts');
const devServerProxy = require("./config/devServerProxy");

/**
 * Webpack configuration for Direflow Component
 * Additional webpack plugins / overrides can be provided here
 */
module.exports = {
  webpack: (config, env) => {
    return {
      ...webpackConfig(config, env),
      // Add your own webpack config here (optional)
    };
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      // Config your own devServer proxy in ./config/devServerProxy.js
      proxy = devServerProxy();

      const config = configFunction(proxy, allowedHost);
      return config;
    };
  },
};
