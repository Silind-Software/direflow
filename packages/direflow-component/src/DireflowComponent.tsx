import WebComponentFactory from './WebComponentFactory';
import { IDireflowPlugin, IDireflowConfig } from './types/DireflowConfig';
import includePolyfills from './services/polyfillHandler';

class DireflowComponent {
  private componentProperties?: { [key: string]: unknown };
  private rootComponent?: React.FC<any> | React.ComponentClass<any, any>;
  private WebComponent?: typeof HTMLElement;
  private elementName?: string;
  private plugins?: IDireflowPlugin[];
  private shadow = true;

  /**
   * Configure Direflow Component
   * @param config direflow configuration
   */
  public configure(config: IDireflowConfig) {
    this.componentProperties = config.properties;
    this.shadow = config.useShadow;
    this.elementName = config.name;
    this.plugins = config.plugins;
  }

  /**
   * Create Direflow Component
   * @param App React Component
   */
  public create(App: React.FC<any> | React.ComponentClass<any, any>): Promise<HTMLElement> {
    return new Promise(async (resolve, reject) => {
      this.rootComponent = App;

      try {
        this.validateDependencies();
      } catch (error) {
        reject(error);
      }

      const callback = (element: HTMLElement) => {
        resolve(element);
      };

      await Promise.all([
        includePolyfills({ usesShadow: !!this.shadow }, this.plugins),
      ]);

      this.WebComponent = new WebComponentFactory(
        this.componentProperties || {},
        this.rootComponent,
        this.shadow,
        this.plugins,
        callback,
      ).create();

      customElements.define(this.elementName || '', this.WebComponent);
    });
  }

  private validateDependencies() {
    if (!this.rootComponent) {
      throw Error('Cannot define custom element: Root Component have not been set.');
    }

    if (!this.elementName) {
      throw Error('Cannot define custom element: Element name has not been set.');
    }
  }
}

export default DireflowComponent;
