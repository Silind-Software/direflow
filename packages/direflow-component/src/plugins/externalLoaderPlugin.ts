import { injectIntoShadowRoot, injectIntoHead } from '../helpers/domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

let didInclude = false;

const externalLoaderPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
) => {
  if (didInclude) {
    return;
  }

  const plugin = plugins?.find((p) => p.name === 'external-loader');
  const paths = plugin?.options?.paths;

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
          didInclude = true;
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

export default externalLoaderPlugin;
