import { injectIntoShadowRoot, stripStyleFromHead } from './domControllers';

let styles = '';

const addStyledComponentStyles = (element: HTMLElement, plugins: IDireflowPlugin[] | undefined) => {
  if (plugins?.find((plugin) => plugin.name === 'styled-components')) {
    setTimeout(() => {
      try {
        if (!styles) {
          // eslint-disable-next-line no-underscore-dangle, no-whitespace-before-property
          const scSecrets = require('styled-components'). __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS;
          const { StyleSheet } = scSecrets;
          styles = StyleSheet.instance.tags[0].css();
          StyleSheet.instance.tags[0].styleTag.setAttribute('id', 'direflow-style');
        }

        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = styles;

        injectIntoShadowRoot(element, styleElement);
        stripStyleFromHead();
      } catch (err) {
        // Suppress error
      }
    });
  }
};

export default addStyledComponentStyles;
