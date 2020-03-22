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
  webComponent: Element;
  mode: 'open' | 'closed';
  shadowChildren: Element[];
}

const Portal: FC<IPortal> = (props) => {
  const targetElement = (props.targetElement as unknown) as Element;
  return createPortal(props.children, targetElement);
};

const createProxyComponent = (options: IComponentOptions) => {
  const ShadowRoot: FC<IShadowComponent> = (props) => {
    const shadowedRoot = options.webComponent.shadowRoot
      || options.webComponent.attachShadow({ mode: options.mode });

    options.shadowChildren.forEach((child) => {
      shadowedRoot.appendChild(child);
    });

    return <Portal targetElement={shadowedRoot}>{props.children}</Portal>;
  };

  return ShadowRoot;
};

const componentMap = new WeakMap<Element, React.FC<IShadowComponent>>();

const createProxyRoot = (
  webComponent: Element,
  shadowChildren: Element[],
): { [key in 'open' | 'closed']: React.FC<IShadowComponent> } => {
  return new Proxy<any>(
    {},
    {
      get(_: unknown, mode: 'open' | 'closed') {
        if (componentMap.get(webComponent)) {
          return componentMap.get(webComponent);
        }

        const proxyComponent = createProxyComponent({ webComponent, mode, shadowChildren });
        componentMap.set(webComponent, proxyComponent);
        return proxyComponent;
      },
    },
  );
};

export default createProxyRoot;
