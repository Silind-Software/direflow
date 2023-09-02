/**
 * Use the mock proxy 
 * 
 * If isMock is true, mockTarget is valid, target is invalid.
 */
 const isMock = false;

/**
 * Change the proxy env 
 * 'test', 'dev', etc. target is valid, mockTarget is invalid.
 */

const env = "dev"; 


/**
 * This is the default devServer proxy config, you can use it in proxyCustomConfig or not.
 */
const DEFAULT_PROXY_CONFIG = {
  secure: false,
  changeOrigin: true,
};

/**
 * Config your proxy api here.
 */
const config = {
  "/api": {
    target: {
      dev: "https://api.dev.com/",
      test: "https://api.test.com/",
    },
    mockTarget: "https://api.mock.com/",
    proxyCustomConfig: { ...DEFAULT_PROXY_CONFIG },
  },
  "/apiAnother": {
    target: {
      dev: "https://api.another.dev.com/",
      test: "https://api.another.test.com/",
    },
    mockTarget: "https://api.another.mock.com/",
    proxyCustomConfig: { ...DEFAULT_PROXY_CONFIG },
  },
};

const proxyConfig = () =>
  Object.entries(config).reduce((acc, [configKey, configValue]) => {
    // Avoid incorrect 'target' config in proxyCustomConfig
    delete configValue.proxyCustomConfig["target"];
    acc[configKey] = {
      target: isMock ? configValue.mockTarget : configValue.target[env],
      ...configValue.proxyCustomConfig,
    };
    return acc;
  }, {});

module.exports = () => proxyConfig();
