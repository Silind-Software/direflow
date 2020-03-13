import React from 'react';
import { IDireflowPlugin } from '../types/DireflowConfig';

const jssCache = new WeakMap<Element, any>();

const handleMaterialUiStyle = (
  webcomponent: Element,
  app: JSX.Element,
  plugins: IDireflowPlugin[] | undefined,
): { mountPoint?: Element; app: JSX.Element } => {
  if (plugins?.find((plugin) => plugin.name === 'material-ui')) {
    try {
      const { create } = require('jss');
      const { jssPreset, StylesProvider } = require('@material-ui/core/styles');

      let jss: any;
      if (jssCache.has(webcomponent)) {
        jss = jssCache.get(webcomponent);
      } else {
        jss = create({
          ...jssPreset(),
          insertionPoint: document.createElement('span'),
        });
        jssCache.set(webcomponent, jss);
      }

      return { mountPoint: jss.options.insertionPoint, app: (<StylesProvider jss={jss}>{app}</StylesProvider>) };
    } catch (err) {
      console.error('Could not load Material-UI', err);
    }
  }
  return { app };
};

export default handleMaterialUiStyle;
