import WebComponentFactory from './WebComponentFactory';
import { IDireflowComponent } from './types/DireflowConfig';
import { DireflowElement } from './types/DireflowElement';
import includePolyfills from './helpers/polyfillHandler';

class DireflowComponent {
  /**
   * Create muliple Direflow Components
   * @param App React Component
   */
  public static createAll(componentConfigs: IDireflowComponent[]): Array<Promise<DireflowElement>> {
    return componentConfigs.map(DireflowComponent.create);
  }

  /**
   * Create Direflow Component
   * @param App React Component
   */
  public static create(componentConfig: IDireflowComponent): Promise<DireflowElement> {
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

    return new Promise(async (resolve) => {
      const callback = (element: HTMLElement) => {
        resolve(element as DireflowElement);
      };

      await Promise.all([includePolyfills({ usesShadow: !!shadow }, plugins)]);

      const WebComponent = new WebComponentFactory(
        componentProperties,
        component,
        shadow,
        plugins,
        callback,
      ).create();

      customElements.define(tagName || '', WebComponent);
    });
  }
}

export default DireflowComponent;
