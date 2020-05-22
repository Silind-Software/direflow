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

  paths.forEach((path: string | { src: string; async?: boolean; useHead?: boolean }) => {
    const actualPath = typeof path === 'string' ? path : path.src;
    const async = typeof path === 'string' ? false : path.async;
    const useHead = typeof path === 'string' ? undefined : path.useHead;

    if (actualPath.endsWith('.js')) {
      const script = document.createElement('script');
      script.src = actualPath;
      script.async = !!async;

      if (useHead !== undefined && !useHead) {
        script.setAttribute('use-head', 'false');
      } else {
        script.setAttribute('use-head', 'true');
      }

      scriptTags.push(script);
    }

    if (actualPath.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = actualPath;

      if (useHead) {
        link.setAttribute('use-head', 'true');
      } else {
        link.setAttribute('use-head', 'false');
      }

      styleTags.push(link);
    }
  });

  const insertionPoint = document.createElement('span');
  insertionPoint.id = 'direflow_external-sources';

  if (!window.externalSourcesLoaded) {
    window.externalSourcesLoaded = {};
  }

  scriptTags.forEach((script) => {
    if (script.getAttribute('use-head') === 'true') {
      injectIntoHead(script);
    } else {
      insertionPoint.appendChild(script);
    }

    window.externalSourcesLoaded[script.src] = {
      state: 'loading',
    };

    script.addEventListener('load', () => {
      window.externalSourcesLoaded[script.src].state = 'completed';
      window.externalSourcesLoaded[script.src].callback?.();
    });
  });

  styleTags.forEach((link) => {
    if (link.getAttribute('use-head') === 'true') {
      injectIntoHead(link);
    } else {
      insertionPoint.appendChild(link);
    }

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
