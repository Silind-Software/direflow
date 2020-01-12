import { injectIntoShadowRoot } from './domControllers';
import { getDireflowPlugin } from '../utils/direflowConfigExtrator';

const includeGoogleIcons = (element: HTMLElement) => {
  const iconLoaderPlugin = getDireflowPlugin('icon-loader');

  if (iconLoaderPlugin?.options?.packs.includes('material-icons')) {
    setTimeout(() => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

      injectIntoShadowRoot(element, link);
    });
  }
};

export { includeGoogleIcons };
