/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import clonedeep from 'lodash.clonedeep';
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

    this.reflectPropertiesToAttributes();
  }

  /**
   * All properties with primitive values are added to attributes.
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

    return class WebComponent extends HTMLElement {
      private initialProperties = clonedeep<{ [key: string]: any }>(factory.componentProperties);
      private properties: { [key: string]: any } = {};

      constructor() {
        super();
        this.transferInitialProperties();
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

        this.properties[name] = newValue;
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
        const propertyMap = {} as PropertyDescriptorMap;
        Object.keys(this.initialProperties).forEach((key: string) => {
          propertyMap[key] = {
            configurable: true,
            enumerable: true,

            get: (): any => {
              const currentValue = this.properties.hasOwnProperty(key)
                ? this.properties[key]
                : this.initialProperties[key];

              return currentValue;
            },

            set: (newValue: any): any => {
              const oldValue = this.properties.hasOwnProperty(key)
                ? this.properties[key]
                : this.initialProperties[key];

              this.propertyChangedCallback(key, oldValue, newValue);
            },
          };
        });

        Object.defineProperties(this, propertyMap);
      }

      /**
       * Syncronize all properties and attributes
       */
      private syncronizePropertiesAndAttributes(): void {
        Object.keys(this.initialProperties).forEach((key: string) => {
          if (this.properties.hasOwnProperty(key)) {
            return;
          }

          if (this.getAttribute(key)) {
            this.properties[key] = this.getAttribute(key);
            return;
          }

          this.properties[key] = this.initialProperties[key];
        });
      }

      /**
       * Transfer initial properties from the custom element.
       */
      private transferInitialProperties(): void {
        Object.keys(this.initialProperties).forEach((key: string) => {
          if (this.hasOwnProperty(key)) {
            this.properties[key] = this[key as keyof WebComponent];
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
      private reactProps(): { [key: string]: any } {
        this.syncronizePropertiesAndAttributes();
        return this.properties;
      }

      /**
       * Mount React App onto the Web Component
       */
      private mountReactApp(options?: { initial: boolean }): void {
        const application = (
          <EventProvider value={this.eventDispatcher}>
            {React.createElement(factory.rootComponent, this.reactProps())}
          </EventProvider>
        );

        if (!factory.shadow) {
          ReactDOM.render(application, this);
          return;
        }

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

      /**
       * Dispatch an event from the Web Component
       */
      private eventDispatcher = (event: Event) => {
        this.dispatchEvent(event);
      };
    };
  }
}

export default WebComponentFactory;
