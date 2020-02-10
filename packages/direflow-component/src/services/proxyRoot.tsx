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
    const currentShadowRoot = options.root.shadowRoot;
    const newShadowRoot = options.root.attachShadow({ mode: options.mode });
    const shadowedRoot = currentShadowRoot || newShadowRoot;

    return <ShadowContent root={shadowedRoot}>{props.children}</ShadowContent>;
  };

  return ShadowRoot;
};

const createProxyRoot = (root: Element) => {
  return new Proxy<any>(
    {},
    {
      get(_: unknown, name: 'open' | 'closed'): any {
        return createProxyComponent({ root, mode: name });
      },
    },
  );
};

export default createProxyRoot;
