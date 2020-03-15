import { IDireflowPlugin } from '../types/DireflowConfig';
import { injectIntoShadowRoot } from '../helpers/domControllers';

const materialUiPlugin = (element: HTMLElement, plugins: IDireflowPlugin[] | undefined) => {
  if (plugins?.find((plugin) => plugin.name === 'material-ui')) {
    setTimeout(() => {
      try {
        let styles = '';

        const allChildren = document.head.children;
        Array.from(allChildren).forEach((child) => {
          if (child.hasAttribute('data-jss')) {
            styles += child.innerHTML;
            document.head.removeChild(child);
          }
        });

        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = styles;

        injectIntoShadowRoot(element, styleElement);

      } catch (error) {
        console.error(
          // Suppress error,
        );
      }
    });
  }
};

export default materialUiPlugin;
