import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { createProxy } from 'react-shadow';
import WebFont from 'webfontloader';
import { EventProvider } from './components/EventContext';
import { injectIntoFirstChild, stripStyleFromHead, injectIntoShadowRoot } from './services/DomControllers';
import { getDireflowPlugin } from './utils/direflowConfigExtrator';

class WebComponentFactory {
  private componentAttributes: any;
  private componentProperties: any;
  private elementName: string;
  private rootComponent: React.FC<any> | React.ComponentClass<any, any>;
  private shadow: boolean | undefined;

  constructor(
    attributes: any,
    properties: any,
    name: string,
    component: React.FC<any> | React.ComponentClass<any, any>,
    shadowOption: boolean,
  ) {
    this.componentAttributes = attributes;
    this.componentProperties = properties;
    this.elementName = name;
    this.rootComponent = component;
    this.shadow = shadowOption;
  }

  public create(): any {
    const factory = this;

    return class extends HTMLElement {
      private _application: JSX.Element | undefined;
      private properties: any = Object.assign({}, factory.componentProperties);

      constructor() {
        super();
        this.setComponentProperties();
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

      public static get observedAttributes(): string[] {
        return Object.keys(factory.componentAttributes).map((k) => k.toLowerCase());
      }

      private reactProps(): any {
        const attributes = {} as any;

        Object.keys(factory.componentAttributes).forEach((key: string) => {
          attributes[key] = this.getAttribute(key) || (factory.componentAttributes as any)[key];
        });

        return { ...attributes, ...factory.componentProperties };
      }

      public connectedCallback(): void {
        this.mountReactApp();
        this.registerComponent();
        this.loadFonts();
        this.includeExternals();
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

      private mountReactApp(): void {
        const application = this.application();

        if (!factory.shadow) {
          ReactDOM.render(application, this);
        } else {
          const root = createProxy({ span: undefined });
          ReactDOM.render(<root.span>{application}</root.span>, this);
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

        if (getDireflowPlugin('styled-components')) {
          setTimeout(() => {
            try {
              const scSecrets = require('styled-components'). __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS;
              const { StyleSheet } = scSecrets;
              const styles = StyleSheet.instance.tags[0].css();

              const styleElement = document.createElement('style');
              styleElement.type = 'text/css';
              styleElement.innerHTML = styles;

              injectIntoFirstChild(this, styleElement);
              stripStyleFromHead();
            } catch (err) {}
          });
        }

        return baseApplication;
      }

      private eventDispatcher = (event: Event) => {
        this.dispatchEvent(event);
      }

      private registerComponent(): void {
        const global = window as any;
        const widget = global.direflowComponents && global.direflowComponents[factory.elementName];
        if (widget && widget.callback) {
          widget.callback(this);
        }
      }

      private loadFonts(): void {
        const fontLoaderPlugin = getDireflowPlugin('font-loader');

        if (fontLoaderPlugin?.options) {
          WebFont.load(fontLoaderPlugin.options);
        }
      }

      private includeExternals(): void {
        const externalLoaderPlugin = getDireflowPlugin('external-loader');
        const paths = externalLoaderPlugin?.options?.paths;

        if (paths && paths.length) {
          setTimeout(() => {
            paths.forEach((path: string) => {
              if (path.endsWith('.js')) {
                const script = document.createElement('script');
                script.src = path;

                injectIntoShadowRoot(this, script);
              }

              if (path.endsWith('.css')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = path;

                injectIntoShadowRoot(this, link);
              }
            });
          });
        }
      }
    }
  }
}

export default WebComponentFactory;
