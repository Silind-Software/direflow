import WebComponentFactory from './WebComponentFactory';
import { IDireflowComponent } from './types/DireflowConfig';
import { DireflowElement } from './types/DireflowElement';
import includePolyfills from './helpers/polyfillHandler';
import DireflowPromiseAlike from './types/DireflowPromiseAlike';

let _resolve: Function;

const callback = (element: HTMLElement) => {
  _resolve?.(element as DireflowElement);
};

class DireflowComponent {
  /**
   * Create muliple Direflow Components
   * @param App React Component
   */
  public static createAll(componentConfigs: IDireflowComponent[]): Array<DireflowPromiseAlike> {
    return componentConfigs.map(DireflowComponent.create);
  }

  /**
   * Create Direflow Component
   * @param App React Component
   */
  public static create(componentConfig: IDireflowComponent): DireflowPromiseAlike {
    const { component } = componentConfig;
    const plugins = component.plugins || componentConfig.plugins;
    const configuration = component.configuration || componentConfig.configuration;

    if (!component) {
      throw Error('Root component has not been set');
    }

    if (!configuration) {
      throw Error('No configuration found');
    }

    const componentProperties = {
      ...componentConfig?.properties,
      ...component.properties,
      ...component.defaultProps,
    };

    const tagName = configuration.tagname || 'direflow-component';
    const shadow = configuration.useShadow !== undefined ? configuration.useShadow : true;
    const anonymousSlot = configuration.useAnonymousSlot !== undefined ? configuration.useAnonymousSlot : false;
    const namedSlots = Array.isArray(configuration.useNamedSlots) ? configuration.useNamedSlots : false;

    (async () => {
      /**
       * TODO: This part should be removed in next minor version
       */
      await Promise.all([includePolyfills({ usesShadow: !!shadow }, plugins)]);

      const WebComponent = new WebComponentFactory(
        componentProperties,
        component,
        shadow,
        anonymousSlot,
        namedSlots,
        plugins,
        callback,
      ).create();

      customElements.define(tagName, WebComponent);
    })();

    return {
      then: async (resolve?: (element: HTMLElement) => void) => {
        if (resolve) {
          _resolve = resolve;
        }
      },
    };
  }
}

export default DireflowComponent;
