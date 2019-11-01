import { IDireflowComponent } from './IDireflowComponent';

export const registerComponent = (name: string) => {
  const global = window as any;

  const component = global.direflowComponents[name];

  const mount = (callback: (element: IDireflowComponent) => void) => {
    if (component) {
      component.onRegister(callback);
    }

    return {
      onFail: fail,
    };
  };

  const fail = (callback: (errorMessage: string) => void) => {
    if (!component) {
      callback(`The Direflow Component: '${name}' is not found in the registry.`);
    }
  };

  return {
    onMount: mount,
  };
};
