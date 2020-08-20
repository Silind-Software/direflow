/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import clonedeep from 'lodash.clonedeep';
import createProxyRoot from './helpers/proxyRoot';
import { IDireflowPlugin } from './types/DireflowConfig';
import { EventProvider } from './components/EventContext';
import { PluginRegistrator } from './types/PluginRegistrator';
import registeredPlugins from './plugins/plugins';
import getSerialized from './helpers/getSerialized';

class WebComponentFactory {
  constructor(
    private componentProperties: { [key: string]: unknown },
    private rootComponent: React.FC<any> | React.ComponentClass<any, any>,
    private shadow?: boolean,
    private plugins?: IDireflowPlugin[],
    private connectCallback?: (element: HTMLElement) => void,
  ) {
    this.reflectPropertiesToAttributes();
  }

  private componentAttributes: { [key: string]: unknown } = {};

  /**
   * All properties with primitive values are added to attributes.
   */
  private reflectPropertiesToAttributes() {
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
  public create() {
    const factory = this;

    return class WebComponent extends HTMLElement {
      public initialProperties = clonedeep(factory.componentProperties);
      public properties: { [key: string]: unknown } = {};
      public hasConnected = false;

      constructor() {
        super();
        this.transferInitialProperties();
        this.subscribeToProperties();
      }

      /**
       * Observe attributes for changes.
       * Part of the Web Component Standard.
       */
      public static get observedAttributes() {
        return Object.keys(factory.componentAttributes).map((k) => k.toLowerCase());
      }

      /**
       * Web Component gets mounted on the DOM.
       */
      public connectedCallback() {
        this.mountReactApp({ initial: true });
        this.hasConnected = true;
        factory.connectCallback?.(this);
      }

      /**
       * When an attribute is changed, this callback function is called.
       * @param name name of the attribute
       * @param oldValue value before change
       * @param newValue value after change
       */
      public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (!this.hasConnected) {
          return;
        }

        if (oldValue === newValue) {
          return;
        }

        this.properties[name] = getSerialized(newValue);
        this.mountReactApp();
      }

      /**
       * When a property is changed, this callback function is called.
       * @param name name of the property
       * @param oldValue value before change
       * @param newValue value after change
       */
      public propertyChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
        if (!this.hasConnected) {
          return;
        }

        if (oldValue === newValue) {
          return;
        }

        this.properties[name] = newValue;
        this.mountReactApp();
      }

      /**
       * Web Component gets unmounted from the DOM.
       */
      public disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this);
      }

      /**
       * Setup getters and setters for all properties.
       * Here we ensure that the 'propertyChangedCallback' will get invoked
       * when a property changes.
       */
      public subscribeToProperties() {
        const propertyMap = {} as PropertyDescriptorMap;
        Object.keys(this.initialProperties).forEach((key: string) => {
          propertyMap[key] = {
            configurable: true,
            enumerable: true,

            get: (): unknown => {
              const currentValue = this.properties.hasOwnProperty(key)
                ? this.properties[key]
                : this.initialProperties[key];

              return currentValue;
            },

            set: (newValue: unknown) => {
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
      public syncronizePropertiesAndAttributes() {
        Object.keys(this.initialProperties).forEach((key: string) => {
          if (this.properties.hasOwnProperty(key)) {
            return;
          }

          if (this.getAttribute(key) !== null) {
            this.properties[key] = getSerialized(this.getAttribute(key) as string);
            return;
          }

          this.properties[key] = this.initialProperties[key];
        });
      }

      /**
       * Transfer initial properties from the custom element.
       */
      public transferInitialProperties() {
        Object.keys(this.initialProperties).forEach((key: string) => {
          if (this.hasOwnProperty(key)) {
            this.properties[key] = this[key as keyof WebComponent];
          }
        });
      }

      /**
       * Apply plugins
       */
      public applyPlugins(application: JSX.Element): [JSX.Element, Element[]] {
        const shadowChildren: Element[] = [];

        const applicationWithPlugins = registeredPlugins.reduce(
          (app: JSX.Element, currentPlugin: PluginRegistrator) => {
            const pluginResult = currentPlugin(this, factory.plugins, app);

            if (!pluginResult) {
              return app;
            }

            const [wrapper, shadowChild] = pluginResult;

            if (shadowChild) {
              shadowChildren.push(shadowChild);
            }

            return wrapper;
          },
          application,
        );

        return [applicationWithPlugins, shadowChildren];
      }

      /**
       * Generate react props based on properties and attributes.
       */
      public reactProps(): { [key: string]: unknown } {
        this.syncronizePropertiesAndAttributes();
        return this.properties;
      }

      /**
       * Mount React App onto the Web Component
       */
      public mountReactApp(options?: { initial: boolean }) {
        const application = (
          <EventProvider value={this.eventDispatcher}>
            {React.createElement(factory.rootComponent, this.reactProps())}
          </EventProvider>
        );

        const [applicationWithPlugins, shadowChildren] = this.applyPlugins(application);

        if (!factory.shadow) {
          ReactDOM.render(applicationWithPlugins, this);
          return;
        }

        let currentChildren: Node[] | undefined;

        if (options?.initial) {
          currentChildren = Array.from(this.children).map((child: Node) => child.cloneNode(true));
        }

        const root = createProxyRoot(this, shadowChildren);
        ReactDOM.render(<root.open>{applicationWithPlugins}</root.open>, this);

        if (currentChildren) {
          currentChildren.forEach((child: Node) => this.append(child));
        }
      }

      /**
       * Dispatch an event from the Web Component
       */
      public eventDispatcher = (event: Event) => {
        this.dispatchEvent(event);
      };
    };
  }
}

export default WebComponentFactory;
