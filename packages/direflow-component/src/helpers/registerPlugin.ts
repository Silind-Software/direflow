import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const registerPlugin = (pluginFn: PluginRegistrator) => {
  return (
    element: HTMLElement,
    plugins: IDireflowPlugin[] | undefined,
    app?: JSX.Element,
  ) => pluginFn(element, plugins, app);
};

export default registerPlugin;
