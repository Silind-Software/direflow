import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const registerPlugin = (registrator: PluginRegistrator) => {
  return (
    element: HTMLElement,
    plugins: IDireflowPlugin[] | undefined,
    app?: JSX.Element,
  ) => registrator(element, plugins, app);
};

export default registerPlugin;
