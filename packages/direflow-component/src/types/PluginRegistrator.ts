import { IDireflowPlugin } from './DireflowConfig';

export type PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => [JSX.Element, Element?] | void;
