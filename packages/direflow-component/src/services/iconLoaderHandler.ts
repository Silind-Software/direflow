import { injectIntoShadowRoot } from './domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';

const includeGoogleIcons = (element: HTMLElement, plugins: IDireflowPlugin[] | undefined) => {
  const iconLoaderPlugin = plugins?.find((plugin) => plugin.name === 'icon-loader');

  if (iconLoaderPlugin?.options?.packs.includes('material-icons')) {
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

      injectIntoShadowRoot(element, link);
    });
  }
};

export default includeGoogleIcons;
