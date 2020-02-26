import { injectIntoShadowRoot, injectIntoHead } from './domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';

const includeExternalSources = (element: HTMLElement, plugins: IDireflowPlugin[] | undefined) => {
  const externalLoaderPlugin = plugins?.find((plugin) => plugin.name === 'external-loader');
  const paths = externalLoaderPlugin?.options?.paths;

  if (paths && paths.length) {
    setTimeout(() => {
      paths.forEach((path: string) => {
        if (path.endsWith('.js')) {
          const script = document.createElement('script');
          script.src = path;

          injectIntoHead(script);
        }

        if (path.endsWith('.css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = path;

          injectIntoShadowRoot(element, link);
        }
      });
    });
  }
};

export default includeExternalSources;
