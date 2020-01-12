import React from 'react';
import ReactDOM from 'react-dom';
import createProxyRoot from './services/proxyRoot';
import { EventProvider } from './components/EventContext';
import addStyledComponentStyles from './services/styledComponentsHandler';
import includeExternalSources from './services/externalSourceHandler';
import loadFonts from './services/fontLoaderHandler';
import { includeGoogleIcons } from './services/iconLoaderHandler';
import includePolyfills from './services/polyfillHandler';

class WebComponentFactory {
  private componentAttributes: any;
  private componentProperties: any;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any>;
  private callback: ((component: Element) => void) | null;
  private shadow: boolean | undefined;

  constructor(
    properties: any,
    component: React.FC<any> | React.ComponentClass<any, any>,
    callback: ((component: Element) => void) | null,
    shadowOption: boolean,
  ) {
    this.componentAttributes = {};
    this.componentProperties = properties;
    this.rootComponent = component;
    this.callback = callback;
    this.shadow = shadowOption;
  }

  private reflectPropertiesAndAttributes(): void {
    Object.entries(this.componentProperties).forEach(([key, value]) => {
      if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'boolean') {
        return;
      }

      this.componentAttributes[key] = value;
    });
  }

  public async create(): Promise<any> {
    const factory = this;

    await includePolyfills({ usesShadow: !!factory.shadow });

    return class extends HTMLElement {
      private _application: JSX.Element | undefined;
      private properties: any = Object.assign({}, factory.componentProperties);

      constructor() {
        super();
        this.setComponentProperties();
      }

      public static get observedAttributes(): string[] {
        return Object.keys(factory.componentAttributes).map((k) => k.toLowerCase());
      }

      public connectedCallback(): void {
        this.preparePropertiesAndAttributes();
        this.preparePlugins();
        this.mountReactApp();

        factory.callback?.(this);
      }

      public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
          return;
        }

        this.mountReactApp();
      }

      public reactPropsChangedCallback(name: string, oldValue: any, newValue: any): void {
        if (oldValue === newValue) {
          return;
        }

        factory.componentProperties[name] = newValue;

        this.mountReactApp();
      }

      public disconnectedCallback(): void {
        ReactDOM.unmountComponentAtNode(this);
      }

      private setComponentProperties(): void {
        if (!factory.rootComponent) {
          return;
        }

        const propertyMap = {} as PropertyDescriptorMap;
        Object.keys(this.properties).forEach((key: string) => {
          propertyMap[key] = {
            configurable: true,
            enumerable: true,
            get(): any {
              return (this as any).properties[key];
            },
            set(newValue: any): any {
              const oldValue = (this as any).properties[key];
              (this as any).properties[key] = newValue;
              (this as any).reactPropsChangedCallback(key, oldValue, newValue);
            },
          };
        });

        Object.defineProperties(this, propertyMap);
      }

      private preparePropertiesAndAttributes(): void {
        Object.keys(factory.componentProperties).forEach((key: string) => {
          factory.componentProperties[key] = this.getAttribute(key) || (factory.componentProperties as any)[key];
        });
      }

      private preparePlugins(): void {
        loadFonts();
        includeGoogleIcons(this);
        includeExternalSources(this);
        addStyledComponentStyles(this);
      }

      private reactProps(): any {
        factory.reflectPropertiesAndAttributes();
        return { ...factory.componentProperties };
      }

      private mountReactApp(): void {
        const application = this.application();

        if (!factory.shadow) {
          ReactDOM.render(application, this);
        } else {
          const root = createProxyRoot(this);
          ReactDOM.render(<root.open>{application}</root.open>, this);
        }
      }

      private application(): JSX.Element {
        if (this._application) {
          return this._application;
        }

        const baseApplication = (
          <EventProvider value={this.eventDispatcher}>
            {React.createElement(factory.rootComponent, this.reactProps())}
          </EventProvider>
        );

        return baseApplication;
      }

      private eventDispatcher = (event: Event) => {
        this.dispatchEvent(event);
      }
    }
  }
}

export default WebComponentFactory;
