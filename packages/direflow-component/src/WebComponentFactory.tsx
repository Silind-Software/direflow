/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import { IDireflowPlugin } from './interfaces/IDireflowConfig';
import createProxyRoot from './services/proxyRoot';
import addStyledComponentStyles from './services/styledComponentsHandler';
import includeExternalSources from './services/externalSourceHandler';
import loadFonts from './services/fontLoaderHandler';
import includePolyfills from './services/polyfillHandler';
import includeGoogleIcons from './services/iconLoaderHandler';
import { EventProvider } from './components/EventContext';

class WebComponentFactory {
  private componentAttributes: any;
  private componentProperties: any;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any>;
  private shadow: boolean | undefined;
  private plugins: IDireflowPlugin[] | undefined;
  private connectCallback: (element: HTMLElement) => void;

  constructor(
    properties: any,
    component: React.FC<any> | React.ComponentClass<any, any>,
    shadowOption: boolean,
    plugins: IDireflowPlugin[] | undefined,
    connectCallback: (element: HTMLElement) => void,
  ) {
    this.componentAttributes = {};
    this.componentProperties = properties;
    this.rootComponent = component;
    this.shadow = shadowOption;
    this.plugins = plugins;
    this.connectCallback = connectCallback;
  }

  /**
   * All properties with primitive values is added to attributes.
   */
  private reflectPropertiesToAttributes(): void {
    Object.entries(this.componentProperties).forEach(([key, value]) => {
      if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'boolean') {
        return;
      }

      this.componentAttributes[key] = value;
    });
  }

  /**
   * Create new class that will serve as the Web Component.
   */
  public async create(): Promise<any> {
    const factory = this;

    /**
     * Wait for Web Component polyfills to be included in the host application.
     * Polyfill scripts are loaded async.
     */
    await includePolyfills({ usesShadow: !!factory.shadow }, this.plugins);

    return class extends HTMLElement {
      private _application: JSX.Element | undefined;

      constructor() {
        super();
        this.subscribeToProperties();
      }

      /**
       * Observe attributes for changes.
       * Part of the Web Component Standard.
       */
      public static get observedAttributes(): string[] {
        return Object.keys(factory.componentAttributes).map((k) => k.toLowerCase());
      }

      /**
       * Web Component gets mounted on the DOM.
       */
      public connectedCallback(): void {
        this.preparePropertiesAndAttributes();
        this.preparePlugins();
        this.mountReactApp({ initial: true });

        factory.connectCallback(this);
      }

      /**
       * When an attribute is changed, this callback function is called.
       * @param name name of the attribute
       * @param oldValue value before change
       * @param newValue value after change
       */
      public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
          return;
        }

        this.mountReactApp();
      }

      /**
       * When a property is changed, this callback function is called.
       * @param name name of the property
       * @param oldValue value before change
       * @param newValue value after change
       */
      public propertyChangedCallback(name: string, oldValue: any, newValue: any): void {
        if (oldValue === newValue) {
          return;
        }

        factory.componentProperties[name] = newValue;

        this.mountReactApp();
      }

      /**
       * Web Component gets unmounted from the DOM.
       */
      public disconnectedCallback(): void {
        ReactDOM.unmountComponentAtNode(this);
      }

      /**
       * Setup getters and setters for all properties.
       * Here we ensure that the 'propertyChangedCallback' will get invoked
       * when a property changes.
       */
      private subscribeToProperties(): void {
        if (!factory.rootComponent) {
          return;
        }

        const properties = { ...factory.componentProperties };
        const self: any = this;

        Object.keys(properties).forEach((key) => {
          if (self[key] != null) {
            properties[key] = self[key];
          }
        });

        const propertyMap = {} as PropertyDescriptorMap;
        Object.keys(properties).forEach((key: string) => {
          const presetValue = self[key];

          propertyMap[key] = {
            configurable: true,
            enumerable: true,

            get(): any {
              return presetValue || properties[key];
            },

            set(newValue: any): any {
              const oldValue = properties[key];
              properties[key] = newValue;
              self.propertyChangedCallback(key, oldValue, newValue);
            },
          };
        });

        Object.defineProperties(self, propertyMap);
      }

      /**
       * Prepare all properties and attributes
       */
      private preparePropertiesAndAttributes(): void {
        const self: any = this;

        Object.keys(factory.componentProperties).forEach((key: string) => {
          if (self.getAttribute(key)) {
            factory.componentProperties[key] = self.getAttribute(key);
          } else if (self[key] != null) {
            factory.componentProperties[key] = self[key];
          }
        });
      }

      /**
       * Fetch and prepare all plugins.
       */
      private preparePlugins(): void {
        loadFonts(factory.plugins);
        includeGoogleIcons(this, factory.plugins);
        includeExternalSources(this, factory.plugins);
        addStyledComponentStyles(this, factory.plugins);
      }

      /**
       * Generate react props based on properties and attributes.
       */
      // eslint-disable-next-line class-methods-use-this
      private reactProps(): any {
        factory.reflectPropertiesToAttributes();
        return { ...factory.componentProperties };
      }

      /**
       * Mount React App onto the Web Component
       */
      private mountReactApp(options?: { initial: boolean }): void {
        const application = this.application();

        if (!factory.shadow) {
          ReactDOM.render(application, this);
        } else {
          let currentChildren: Node[] | undefined;

          if (options?.initial) {
            currentChildren = Array.from(this.children).map((child: Node) => child.cloneNode(true));
          }

          const root = createProxyRoot(this);
          ReactDOM.render(<root.open>{application}</root.open>, this);

          if (currentChildren) {
            currentChildren.forEach((child: Node) => this.append(child));
          }
        }
      }

      /**
       * Create the React App
       */
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

      /**
       * Dispatch an event on behalf of the Web Component
       */
      private eventDispatcher = (event: Event) => {
        this.dispatchEvent(event);
      };
    };
  }
}

export default WebComponentFactory;
