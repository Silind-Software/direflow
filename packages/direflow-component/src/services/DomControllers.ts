export const getAdditionalChildren = (webComponent: HTMLElement): Element[] => {
  const allChildren = webComponent.children;
  return Array.from(allChildren).filter((child) => child.nodeName !== 'SPAN');
};

export const getAppElement = (webComponent: HTMLElement): Element | undefined => {
  const allChildren = webComponent.children;
  const shadowHost = Array.from(allChildren).find((child) => child.nodeName === 'SPAN');

  return shadowHost?.shadowRoot?.children[0];
};

export const injectIntoFirstChild = (webComponent: HTMLElement, element: Element): void => {
  const allChildren = webComponent.children;
  const shadowHost = Array.from(allChildren).find((child) => child.nodeName === 'SPAN');

  shadowHost?.shadowRoot?.children[0]?.prepend(element);
};

export const injectIntoShadowRoot = (webComponent: HTMLElement, element: Element): void => {
  const allChildren = webComponent.children;
  const shadowHost = Array.from(allChildren).find((child) => child.nodeName === 'SPAN');

  shadowHost?.shadowRoot?.prepend(element);
};

export const stripStyleFromHead = () => {
  const allChildren = document.head.children;
  const style = Array.from(allChildren).find((child) => child.hasAttribute('data-styled'));

  if (style) {
    document.head.removeChild(style);
  }
};
