export const injectIntoShadowRoot = (webComponent: HTMLElement, element: Element): void => {
  const elementToPrepend = webComponent.shadowRoot || webComponent;

  if (existsIdenticalElement(element, elementToPrepend)) {
    return;
  }

  elementToPrepend.prepend(element);
};

export const injectIntoHead = (element: Element) => {
  if (existsIdenticalElement(element, document.head)) {
    return;
  }

  document.head.append(element);
};

export const stripStyleFromHead = () => {
  const allChildren = document.head.children;
  const style = Array.from(allChildren).find((child) => child.id === 'direflow-style');

  if (style) {
    document.head.removeChild(style);
  }
};

export const existsIdenticalElement = (element: Element, host: Element | ShadowRoot): boolean => {
  const allChildren = host.children;
  const exists = Array.from(allChildren).some((child) => element.isEqualNode(child));
  return exists;
};

export const unwrapToParent = (element: Element) => {
  const child = element.firstChild;
  const parent = element.parentNode;

  if (child) {
    parent?.appendChild(child);
  }

  if (parent) {
    parent.removeChild(element);
  }
};
