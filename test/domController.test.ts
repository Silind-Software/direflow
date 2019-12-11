import { JSDOM } from 'jsdom';
import { 
  getAdditionalChildren,
  getAppElement,
  injectIntoFirstChild,
  injectIntoShadowRoot,
  injectIntoHead,
  stripStyleFromHead
} from '../packages/direflow-component/src/services/domControllers';

const dom = new JSDOM();
(global as any).document = dom.window.document;
(global as any).window = dom.window;

const webComponent = document.createElement('div');
const emptyWebComponent = document.createElement('div');
const shadowHost = document.createElement('span');
const appElement = document.createElement('div');
shadowHost.attachShadow({ mode: 'open' });
shadowHost.shadowRoot?.append(appElement);
appElement.id = 'app';

webComponent.append(document.createElement('style'));
webComponent.append(document.createElement('script'));
webComponent.append(shadowHost);

describe('Get Additional Children', () => {
  it('should get correct number of additional children', () => {
    const elements = getAdditionalChildren(webComponent);
    expect(elements.length).toBe(2);
  });

  it('should get correct first additional children', () => {
    const elements = getAdditionalChildren(webComponent);
    expect(elements[0].nodeName).toBe('STYLE');
  });

  it('should get correct second additional children', () => {
    const elements = getAdditionalChildren(webComponent);
    expect(elements[1].nodeName).toBe('SCRIPT');
  });
});

describe('Get App Element', () => {
  it('should get an element if exists', () => {
    const element = getAppElement(webComponent);
    expect(element).toBeTruthy();
  });

  it('should get undefined if not exists', () => {
    const element = getAppElement(emptyWebComponent);
    expect(element).toBeUndefined();
  });

  it('should get correct app element', () => {
    const element = getAppElement(webComponent);
    expect(element?.id).toBe('app');
  });
});

describe('Inject into first child', () => {
  it('should correctly into first child', () => {
    const element = document.createElement('div');
    element.id = 'injected_first_child';

    injectIntoFirstChild(webComponent, element);
    const appElement = getAppElement(webComponent);

    expect(appElement?.children[0]?.id).toBe('injected_first_child');
  });
});

describe('Inject into Shadow Root', () => {
  it('should correctly inject into Shadow Root', () => {
    const element = document.createElement('div');
    element.id = 'injected_shadow';

    injectIntoShadowRoot(webComponent, element);

    expect(shadowHost.shadowRoot?.children[0]?.id).toBe('injected_shadow');
  });
});

describe('Inject into head', () => {
  it('should correctly inject into head', () => {
    const element = document.createElement('style');
    element.setAttribute('data-styled', 'true');
    injectIntoHead(element);

    expect(document.head.children[0]?.getAttribute('data-styled')).toBe('true');
  });
});

describe('Strip style from head', () => {
  it('should correctly strip style from head', () => {
    stripStyleFromHead();
    expect(document.head.children[0]).toBeUndefined();
  });
});
