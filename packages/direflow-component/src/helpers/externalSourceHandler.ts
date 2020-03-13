import { injectIntoShadowRoot, injectIntoHead } from './domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';

const includeExternalSources = (element: HTMLElement, plugins: IDireflowPlugin[] | undefined) => {
  const externalLoaderPlugin = plugins?.find((plugin) => plugin.name === 'external-loader');
  const paths = externalLoaderPlugin?.options?.paths;

  if (paths && paths.length) {
    setTimeout(() => {
      paths.forEach((path: string | { src: string; async: boolean }) => {
        const actualPath = typeof path === 'string' ? path : path.src;
        const async = typeof path === 'string' ? false : path.async;

        if (actualPath.endsWith('.js')) {
          const script = document.createElement('script');
          script.src = actualPath;
          script.async = async;

          injectIntoHead(script);
        }

        if (actualPath.endsWith('.css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = actualPath;

          injectIntoShadowRoot(element, link);
        }
      });
    });
  }
};

export default includeExternalSources;
