export const injectIntoShadowRoot = (webComponent: HTMLElement, element: Element): void => {
  webComponent.shadowRoot?.prepend(element);
};

export const injectIntoHead = (element: Element) => {
  document.head.append(element);
};

export const stripStyleFromHead = () => {
  const allChildren = document.head.children;
  const style = Array.from(allChildren).find((child) => child.id === 'direflow-style');

  if (style) {
    document.head.removeChild(style);
  }
};
