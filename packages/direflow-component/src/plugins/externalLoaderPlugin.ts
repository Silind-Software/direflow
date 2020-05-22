import { injectIntoHead } from '../helpers/domControllers';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

type TSource = {
  [key: string]: {
    state: 'loading' | 'completed';
    callback?: Function | null;
  };
};

declare global {
  interface Window {
    externalSourcesLoaded: TSource;
  }
}

const externalLoaderPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => {
  const plugin = plugins?.find((p) => p.name === 'external-loader');
  const paths = plugin?.options?.paths;

  if (!paths || !paths.length || !app) {
    return;
  }

  const scriptTags: HTMLScriptElement[] = [];
  const styleTags: HTMLLinkElement[] = [];

  paths.forEach((path: string | { src: string; async: boolean }) => {
    const actualPath = typeof path === 'string' ? path : path.src;
    const async = typeof path === 'string' ? false : path.async;

    if (actualPath.endsWith('.js')) {
      const script = document.createElement('script');
      script.src = actualPath;
      script.async = async;

      scriptTags.push(script);
    }

    if (actualPath.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = actualPath;

      styleTags.push(link);
    }
  });

  if (!window.externalSourcesLoaded) {
    window.externalSourcesLoaded = {};
  }

  scriptTags.forEach((script) => {
    injectIntoHead(script);
    window.externalSourcesLoaded[script.src] = {
      state: 'loading',
    };

    script.addEventListener('load', () => {
      window.externalSourcesLoaded[script.src].state = 'completed';
      window.externalSourcesLoaded[script.src].callback?.();
    });
  });

  const insertionPoint = document.createElement('span');
  insertionPoint.id = 'direflow_external-styles';

  styleTags.forEach((link) => {
    insertionPoint.appendChild(link);
    window.externalSourcesLoaded[link.href] = {
      state: 'loading',
    };

    link.addEventListener('load', () => {
      window.externalSourcesLoaded[link.href].state = 'completed';
      window.externalSourcesLoaded[link.href].callback?.();
    });
  });

  return [app, insertionPoint];
};

export default externalLoaderPlugin;
