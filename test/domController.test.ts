import { JSDOM } from 'jsdom';
import { 
  injectIntoShadowRoot,
  injectIntoHead,
  stripStyleFromHead
} from '../packages/direflow-component/src/services/domControllers';

const dom = new JSDOM();
(global as any).document = dom.window.document;
(global as any).window = dom.window;

const webComponent = document.createElement('div');
const appElement = document.createElement('div');
webComponent.attachShadow({ mode: 'open' });
webComponent.shadowRoot?.append(appElement);

appElement.id = 'app';
appElement.append(document.createElement('style'));
appElement.append(document.createElement('script'));

describe('Inject into Shadow Root', () => {
  it('should correctly inject into Shadow Root', () => {
    const element = document.createElement('div');
    element.id = 'injected_shadow';

    injectIntoShadowRoot(webComponent, element);

    expect(webComponent.shadowRoot?.children[0]?.id).toBe('injected_shadow');
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
