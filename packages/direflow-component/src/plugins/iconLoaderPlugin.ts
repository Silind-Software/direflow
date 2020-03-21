import { injectIntoShadowRoot } from '../helpers/domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

let didInclude = false;

const iconLoaderPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
) => {
  if (didInclude) {
    return;
  }

  const plugin = plugins?.find((p) => p.name === 'icon-loader');

  if (plugin?.options?.packs.includes('material-icons')) {
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

      injectIntoShadowRoot(element, link);
      didInclude = true;
    });
  }
};

export default iconLoaderPlugin;
