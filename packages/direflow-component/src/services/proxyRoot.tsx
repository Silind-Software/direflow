import React, { FC } from 'react';
import { createPortal } from 'react-dom';

interface IShadowContent {
  root: ShadowRoot | Element;
  children: React.ReactNode;
}

interface IShadowComponent {
  children: React.ReactNode | React.ReactNode[];
}

interface IComponentOptions {
  root: Element;
  mode: 'open' | 'closed';
  mountPoint?: Element;
}

const ShadowContent: FC<IShadowContent> = (props) => {
  const root = props.root as unknown as Element;
  return createPortal(props.children, root);
};

const createProxyComponent = (options: IComponentOptions) => {
  const ShadowRoot: FC<IShadowComponent> = (props) => {
    let shadowedRoot: ShadowRoot | Element = options.root.shadowRoot
    || options.root.attachShadow({ mode: options.mode });

    if (options.mountPoint) {
      shadowedRoot = shadowedRoot.appendChild(options.mountPoint);
    }

    return <ShadowContent root={shadowedRoot}>{props.children}</ShadowContent>;
  };

  return ShadowRoot;
};

const componentMap = new WeakMap<Element, React.FC<IShadowComponent>>();

const createProxyRoot = (root: Element, mountPoint?: Element): { [key in 'open' | 'closed']: React.FC<IShadowComponent> } => {
  return new Proxy<any>(
    {},
    {
      get(_: unknown, name: 'open' | 'closed') {
        if (componentMap.get(root)) {
          return componentMap.get(root);
        }

        const proxyComponent = createProxyComponent({ root, mode: name , mountPoint});
        componentMap.set(root, proxyComponent);
        return proxyComponent;
      },
    },
  );
};

export default createProxyRoot;
