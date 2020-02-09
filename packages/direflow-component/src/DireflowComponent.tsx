import IDireflowConfig, { IDireflowPlugin } from './interfaces/IDireflowConfig';
import WebComponentFactory from './WebComponentFactory';

export class DireflowComponent {
  private componentProperties: any | undefined;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any> | undefined;
  private WebComponent: any | undefined;
  private shadow = true;
  private elementName: string | undefined;
  private plugins: IDireflowPlugin[] | undefined;

  /**
   * Configure Direflow Component
   * @param config direflow configuration
   */
  public configure(config: IDireflowConfig): void {
    this.componentProperties = config.properties;
    this.shadow = config.useShadow;
    this.elementName = config.name;
    this.plugins = config.plugins;
  }

  /**
   * Create Direflow Component
   * @param App React Component
   */
  public create(
    App: React.FC<any> | React.ComponentClass<any, any>,
  ): Promise<HTMLElement> {
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

      this.WebComponent = await new WebComponentFactory(
        this.componentProperties || {},
        this.rootComponent,
        this.shadow,
        this.plugins,
        callback,
      ).create();

      customElements.define(this.elementName || '', this.WebComponent);
    });
  }

  private validateDependencies(): void {
    if (!this.rootComponent) {
      throw Error('Cannot define custom element: Root Component have not been set.');
    }

    if (!this.elementName) {
      throw Error('Cannot define custom element: Element name has not been set.');
    }
  }
}
