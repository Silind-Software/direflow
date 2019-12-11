import WebComponentFactory from './WebComponentFactory';

export class DireflowComponent {
  private componentAttributes: any | null = null;
  private componentProperties: any | null = null;
  private elementName: string | null = null;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any> | null = null;
  private callback: ((component: Element) => void) | null = null;
  private shadow: boolean = true;
  private WebComponent: any | null = null;

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

  public onConnected(callback: (component: Element) => void): void {
    this.callback = callback;
  }

  public render(
    App: React.FC<any> | React.ComponentClass<any, any>,
    name: string,
  ): void {
    this.rootComponent = App;
    this.elementName = name;

    this.validateDependencies();

    this.WebComponent = new WebComponentFactory(
      this.componentAttributes || {},
      this.componentProperties || {},
      this.rootComponent,
      this.callback,
      this.shadow
    ).create();

    customElements.define(this.elementName, this.WebComponent);
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
