import React, { FC } from 'react';
import { createPortal } from 'react-dom';

interface IShadowContent {
  root: ShadowRoot;
  children: React.ReactNode;
}

interface IShadowComponent {
  children: React.ReactNode | React.ReactNode[];
}

interface IComponentOptions {
  root: Element;
  mode: 'open' | 'closed';
}

const ShadowContent: FC<IShadowContent> = (props) => {
  const root = props.root as any;
  return createPortal(props.children, root);
};

const createProxyComponent = (options: IComponentOptions) => {
  const ShadowRoot: FC<IShadowComponent> = (props) => {
    const shadowedRoot = options.root.shadowRoot
    || options.root.attachShadow({ mode: options.mode });

    return <ShadowContent root={shadowedRoot}>{props.children}</ShadowContent>;
  };

  return ShadowRoot;
};

const componentMap = new WeakMap<Element, React.FC<IShadowComponent>>();

const createProxyRoot = (root: Element) => {
  return new Proxy<any>(
    {},
    {
      get(_: unknown, name: 'open' | 'closed'): any {
        if (componentMap.get(root)) {
          return componentMap.get(root);
        }

        const proxyComponent = createProxyComponent({ root, mode: name });
        componentMap.set(root, proxyComponent);
        return proxyComponent;
      },
    },
  );
};

export default createProxyRoot;
