import { getDireflowPlugin } from '../utils/direflowConfigExtrator';
import { injectIntoShadowRoot, injectIntoHead } from './domControllers';

let didIncludeOnce = false;

const includeExternalSources = (element: HTMLElement) => {
  const externalLoaderPlugin = getDireflowPlugin('external-loader');
  const paths = externalLoaderPlugin?.options?.paths;

  if (paths && paths.length) {
    setTimeout(() => {
      paths.forEach((path: string) => {
        if (!didIncludeOnce && path.endsWith('.js')) {
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

      didIncludeOnce = true;
    });
  }
}

export default includeExternalSources;
