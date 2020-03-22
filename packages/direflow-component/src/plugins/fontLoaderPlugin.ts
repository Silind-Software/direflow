import WebFont from 'webfontloader';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

let didInclude = false;

const fontLoaderPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
) => {
  if (didInclude) {
    return;
  }

  const plugin = plugins?.find((p) => p.name === 'font-loader');

  if (plugin?.options) {
    WebFont.load(plugin.options);
    didInclude = true;
  }
};

export default fontLoaderPlugin;
