import WebFont from 'webfontloader';
import { IDireflowPlugin } from '../types/DireflowConfig';

const fontLoaderPlugin = (plugins: IDireflowPlugin[] | undefined) => {
  const plugin = plugins?.find((p) => p.name === 'font-loader');

  if (plugin?.options) {
    WebFont.load(plugin.options);
  }
};

export default fontLoaderPlugin;
