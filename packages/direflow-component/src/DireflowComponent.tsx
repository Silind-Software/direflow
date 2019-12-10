import WebComponentFactory from './WebComponentFactory';

export class DireflowComponent {
  private componentAttributes: any | null = null;
  private componentProperties: any | null = null;
  private elementName: string | null = null;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any> | null = null;
  private WebComponent: any | null = null;
  private shadow: boolean = true;

  constructor(option?: { shadow: boolean }) {
    if (option && !option.shadow) {
      this.shadow = false;
    }
  }

  public setAttributes(attributes: any): void {
    this.componentAttributes = attributes;
  }

  public setProperties(properties: any): void {
    this.componentProperties = properties;
  }

  public render(
    App: React.FC<any> | React.ComponentClass<any, any>,
    name: string,
    
  ): void {
    this.rootComponent = App;
    this.elementName = name;

    this.validateDependencies();

    this.WebComponent = new WebComponentFactory(
      this.componentAttributes,
      this.componentProperties,
      this.elementName,
      this.rootComponent,
      this.shadow
    ).create();

    customElements.define(this.elementName, this.WebComponent);
  }

  private validateDependencies(): void {
    if (!this.componentAttributes) {
      throw Error('Cannot define custom element: Attributes have not been set.');
    }

    if (!this.componentProperties) {
      throw Error('Cannot define custom element: Properties have not been set.');
    }

    if (!this.rootComponent) {
      throw Error('Cannot define custom element: Root Component have not been set.');
    }

    if (!this.elementName) {
      throw Error('Cannot define custom element: Element name has not been set.');
    }
  }
}
