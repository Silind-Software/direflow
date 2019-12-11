import { getDireflowPlugin } from '../utils/direflowConfigExtrator';
import { injectIntoShadowRoot, stripStyleFromHead } from './domControllers';

let styles = '';

const addStyledComponentStyles = (element: HTMLElement) => {
  if (getDireflowPlugin('styled-components')) {
    setTimeout(() => {
      try {
        if (!styles) {
          const scSecrets = require('styled-components'). __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS;
          const { StyleSheet } = scSecrets;
          styles = StyleSheet.instance.tags[0].css();
        }

        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = styles;

        injectIntoShadowRoot(element, styleElement);
        stripStyleFromHead();
      } catch (err) {}
    });
  }
};

export default addStyledComponentStyles;
