/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import clonedeep from 'lodash.clonedeep';
import createProxyRoot from './helpers/proxyRoot';
import addStyledComponentStyles from './helpers/styledComponentsHandler';
import includeExternalSources from './helpers/externalSourceHandler';
import loadFonts from './helpers/fontLoaderHandler';
import includeGoogleIcons from './helpers/iconLoaderHandler';
import { EventProvider } from './components/EventContext';
import { IDireflowPlugin } from './types/DireflowConfig';
import handleMaterialUiStyle from './helpers/materialUiStylesHandler';

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
        this.preparePlugins();
        this.mountReactApp({ initial: true });

        factory.connectCallback?.(this);
      }

      /**
       * When an attribute is changed, this callback function is called.
       * @param name name of the attribute
       * @param oldValue value before change
       * @param newValue value after change
       */
      public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
      public propertyChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
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
      public transferInitialProperties() {
        Object.keys(this.initialProperties).forEach((key: string) => {
          if (this.hasOwnProperty(key)) {
            this.properties[key] = this[key as keyof WebComponent];
          }
        });
      }

      /**
       * Fetch and prepare all plugins.
       */
      public preparePlugins() {
        loadFonts(factory.plugins);
        includeGoogleIcons(this, factory.plugins);
        includeExternalSources(this, factory.plugins);
        addStyledComponentStyles(this, factory.plugins);
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

        if (!factory.shadow) {
          ReactDOM.render(application, this);
          return;
        }

        let currentChildren: Node[] | undefined;

        if (options?.initial) {
          currentChildren = Array.from(this.children).map((child: Node) => child.cloneNode(true));
        }

        const wrappedAppAndMountPoint = handleMaterialUiStyle(this, application, factory.plugins);
        const root = createProxyRoot(this, wrappedAppAndMountPoint.mountPoint);
        ReactDOM.render(<root.open>{wrappedAppAndMountPoint.app}</root.open>, this);

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
