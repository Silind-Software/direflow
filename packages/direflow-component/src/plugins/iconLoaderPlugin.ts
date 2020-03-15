import { injectIntoShadowRoot } from '../helpers/domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';

const iconLoaderPlugin = (element: HTMLElement, plugins: IDireflowPlugin[] | undefined) => {
  const plugin = plugins?.find((p) => p.name === 'icon-loader');

  if (plugin?.options?.packs.includes('material-icons')) {
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

      injectIntoShadowRoot(element, link);
    });
  }
};

export default iconLoaderPlugin;
