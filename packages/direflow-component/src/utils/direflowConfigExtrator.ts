import IDireflowConfig, { IDireflowPlugin } from '../interfaces/IDireflowConfig';

let _direflowConfig: IDireflowConfig | undefined;

const getDireflowConfig = (): IDireflowConfig | undefined => {
  if (_direflowConfig) {
    return _direflowConfig;
  }

  try {
    const direflowConfig = require('../../../../direflow-config.js');
    _direflowConfig = direflowConfig;
    return direflowConfig;
  } catch (err) {
    console.warn('direflow-config.js cannot be found.');
  }
};

const direflowConfig = getDireflowConfig();
export default direflowConfig;

export const getDireflowPlugin = (pluginName: string): IDireflowPlugin | undefined => {
  return direflowConfig?.plugins.find((plugin) => plugin.name === pluginName);
};
