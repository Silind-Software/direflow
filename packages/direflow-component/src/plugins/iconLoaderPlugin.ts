import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const iconLoaderPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => {
  const plugin = plugins?.find((p) => p.name === 'icon-loader');

  if (!app) {
    return;
  }

  if (plugin?.options?.packs.includes('material-icons')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

    const insertionPoint = document.createElement('span');
    insertionPoint.id = 'direflow_material-icons';
    insertionPoint.appendChild(link);

    return [app, insertionPoint];
  }
};

export default iconLoaderPlugin;
