import WebComponentFactory from './WebComponentFactory';
import includePolyfills from './services/polyfillHandler';

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
    const { plugins, component } = componentConfig;

    const componentProperties = componentConfig?.properties || {};
    const tagName = componentConfig.configuration.tagname || 'direflow-component';
    const shadow = componentConfig.configuration.useShadow !== undefined
      ? componentConfig.configuration.useShadow
      : true;

    return new Promise(async (resolve, reject) => {
      const callback = (element: HTMLElement) => {
        resolve(element as DireflowElement);
      };

      if (!component) {
        reject(new Error('Root Component has not been set'));
      }

      await Promise.all([
        includePolyfills({ usesShadow: !!shadow }, plugins),
      ]);

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
