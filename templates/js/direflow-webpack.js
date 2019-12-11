const webpackConfig = require('direflow-component/config-overrides');

/**
 * Webpack configuration for Direflow Component
 * Additional webpack plugins / overrides can be provided here
 */
module.exports = (config, env) => ({
  ...webpackConfig(config, env),
  // Add your own webpack config here (optional)
});
