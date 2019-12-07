import WebComponentFactory from './WebComponentFactory';

export class DireflowComponent {
  private componentAttributes: any | null = null;
  private componentProperties: any | null = null;
  private elementName: string | null = null;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any> | null = null;
  private WebComponent: any | null = null;

  public setAttributes(attributes: any): void {
    this.componentAttributes = attributes;
  }

  public setProperties(properties: any): void {
    this.componentProperties = properties;
  }

  public render(
    App: React.FC<any> | React.ComponentClass<any, any>,
    name: string,
    option?: { shadow: boolean },
  ): void {
    this.rootComponent = App;
    this.elementName = name;

    this.validateDependencies();

    this.WebComponent = new WebComponentFactory(
      this.componentAttributes,
      this.componentProperties,
      this.elementName,
      this.rootComponent,
      option?.shadow
    ).create();

    this.setComponentProperties();
    customElements.define(this.elementName, this.WebComponent);
  }

  private setComponentProperties(): void {
    if (!this.rootComponent) {
      return;
    }

    const properties = { ...this.componentProperties };
    const propertyMap = {} as PropertyDescriptorMap;

    Object.keys(properties).forEach((key: string) => {
      const property: PropertyDescriptor = {
        configurable: true,
        enumerable: true,
        get(): any {
          return properties[key];
        },
        set(newValue: any): any {
          const oldValue = properties[key];
          properties[key] = newValue;
          (this as any).reactPropsChangedCallback(key, oldValue, newValue);
        },
      };

      propertyMap[key] = property;
    });

    Object.defineProperties(this.WebComponent.prototype, propertyMap);
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
