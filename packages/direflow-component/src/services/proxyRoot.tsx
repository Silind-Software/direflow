import React, { FC } from 'react';
import { createPortal } from 'react-dom';

interface IPortal {
  targetElement: ShadowRoot;
  children: React.ReactNode;
}

interface IShadowComponent {
  children: React.ReactNode | React.ReactNode[];
}

interface IComponentOptions {
  webcomponent: Element;
  mode: 'open' | 'closed';
  stylesContainer?: Element;
}

const Portal: FC<IPortal> = (props) => {
  const targetElement = (props.targetElement as unknown) as Element;
  return createPortal(props.children, targetElement);
};

const createProxyComponent = (options: IComponentOptions) => {
  const ShadowRoot: FC<IShadowComponent> = (props) => {
    const shadowedRoot: ShadowRoot = options.webcomponent.shadowRoot
      || options.webcomponent.attachShadow({ mode: options.mode });

    if (options.stylesContainer) {
      shadowedRoot.appendChild(options.stylesContainer);
    }

    return <Portal targetElement={shadowedRoot}>{props.children}</Portal>;
  };

  return ShadowRoot;
};

const componentMap = new WeakMap<Element, React.FC<IShadowComponent>>();

const createProxyRoot = (
  webcomponent: Element,
  stylesContainer?: Element,
): { [key in 'open' | 'closed']: React.FC<IShadowComponent> } => {
  return new Proxy<any>(
    {},
    {
      get(_: unknown, mode: 'open' | 'closed') {
        if (componentMap.get(webcomponent)) {
          return componentMap.get(webcomponent);
        }

        const proxyComponent = createProxyComponent({ webcomponent, mode, stylesContainer });
        componentMap.set(webcomponent, proxyComponent);
        return proxyComponent;
      },
    },
  );
};

export default createProxyRoot;
