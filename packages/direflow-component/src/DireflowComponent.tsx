import WebComponent, {
  setComponentAttributes,
  setComponentProperties,
  setRootComponent,
  setMode,
  setElementName,
} from './WebComponent';

let componentAttributes: any | null = null;
let componentProperties: any | null = null;
let elementName: string | null = null;
let rootComponent: React.FC<any> | React.ComponentClass<any, any> | null = null;

export class DireflowComponent {
  public static setAttributes(attributes: any): void {
    componentAttributes = attributes;
  }

  public static setProperties(properties: any): void {
    componentProperties = properties;
  }

  public static render(
    App: React.FC<any> | React.ComponentClass<any, any>,
    name: string,
    option?: { shadow: boolean },
  ): void {
    rootComponent = App;
    elementName = name;

    this.validateDependencies();

    setComponentAttributes(componentAttributes);
    setComponentProperties(componentProperties);
    setElementName(elementName);
    setRootComponent(rootComponent);

    if (option) {
      setMode(option.shadow);
    }

    this.setComponentProperties();
    customElements.define(elementName, WebComponent);
  }

  private static setComponentProperties(): void {
    if (!rootComponent) {
      return;
    }

    const properties = { ...componentProperties };
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

    Object.defineProperties(WebComponent.prototype, propertyMap);
  }

  private static validateDependencies(): void {
    if (!componentAttributes) {
      throw Error('Cannot define custom element: Attributes have not been set.');
    }

    if (!componentProperties) {
      throw Error('Cannot define custom element: Properties have not been set.');
    }

    if (!rootComponent) {
      throw Error('Cannot define custom element: Root Component have not been set.');
    }

    if (!elementName) {
      throw Error('Cannot define custom element: Element name has not been set.');
    }
  }
}
