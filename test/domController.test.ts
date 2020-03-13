import { JSDOM } from 'jsdom';
import {
  injectIntoShadowRoot,
  injectIntoHead,
  stripStyleFromHead,
  existsIdenticalElement,
} from '../packages/direflow-component/src/helpers/domControllers';

const dom = new JSDOM();
(global as any).document = dom.window.document;
(global as any).window = dom.window;

const webComponent = document.createElement('shadow-web-component');
const webComponentNoShadow = document.createElement('no-shadow-web-component');
const appElement = document.createElement('div');
webComponent.attachShadow({ mode: 'open' });
webComponent.shadowRoot?.append(appElement);

const linkElement = document.createElement('link');
linkElement.rel = 'shortcut icon';
linkElement.type = 'image/x-icon';
linkElement.href = 'https://some-test-url.jest';

appElement.id = 'app';
appElement.append(document.createElement('style'));
appElement.append(document.createElement('script'));

appElement.append(linkElement);

describe('Inject into Shadow Root', () => {
  it('should correctly inject into Shadow Root', () => {
    const element = document.createElement('div');
    element.id = 'injected_shadow';

    injectIntoShadowRoot(webComponent, element);

    expect(webComponent.shadowRoot?.children.length).toBe(2);
    expect(webComponent.shadowRoot?.children[0]?.id).toBe('injected_shadow');
  });

  it('should not inject if already exists', () => {
    const element = document.createElement('div');
    element.id = 'injected_shadow';

    injectIntoShadowRoot(webComponent, element);

    expect(webComponent.shadowRoot?.children.length).toBe(2);
  });
});

describe('Inject into Web Component', () => {
  it('should correctly inject into Web Component', () => {
    const element = document.createElement('div');
    element.id = 'injected_no_shadow';

    injectIntoShadowRoot(webComponentNoShadow, element);

    expect(webComponentNoShadow.children.length).toBe(1);
    expect(webComponentNoShadow.children[0]?.id).toBe('injected_no_shadow');
  });

  it('should not inject if already exists', () => {
    const element = document.createElement('div');
    element.id = 'injected_no_shadow';

    injectIntoShadowRoot(webComponentNoShadow, element);

    expect(webComponentNoShadow.children.length).toBe(1);
  });
});

describe('Inject into head', () => {
  it('should correctly inject into head', () => {
    const element = document.createElement('style');
    element.id = 'direflow-style';
    injectIntoHead(element);

    expect(document.head.children.length).toBe(1);
    expect(document.head.children[0]?.id).toBe('direflow-style');
  });

  it('should not inject if already exists', () => {
    const element = document.createElement('style');
    element.id = 'direflow-style';
    injectIntoHead(element);

    expect(document.head.children.length).toBe(1);
    expect(document.head.children[0]?.id).toBe('direflow-style');
  });
});

describe('Strip style from head', () => {
  it('should correctly strip style from head', () => {
    stripStyleFromHead();
    expect(document.head.children.length).toBe(0);
    expect(document.head.children[0]).toBeUndefined();
  });
});

describe('Exists identical element', () => {
  it('should return true if identical element exists', () => {
    const identicalLinkElement = document.createElement('link');
    identicalLinkElement.rel = 'shortcut icon';
    identicalLinkElement.type = 'image/x-icon';
    identicalLinkElement.href = 'https://some-test-url.jest';

    const exists = existsIdenticalElement(identicalLinkElement, appElement);
    expect(exists).toBeTruthy();
  });

  it('should return true if identical element exists', () => {
    const identicalLinkElement = document.createElement('link');
    identicalLinkElement.rel = 'shortcut icon';
    identicalLinkElement.type = 'image/x-icon';
    identicalLinkElement.href = 'https://some-different-url.jest';

    const exists = existsIdenticalElement(identicalLinkElement, appElement);
    expect(exists).toBeFalsy();
  });
});
