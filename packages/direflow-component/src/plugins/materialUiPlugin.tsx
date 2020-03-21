import React from 'react';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const jssCache = new WeakMap<Element, any>();

const materialUiPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => {
  if (plugins?.find((plugin) => plugin.name === 'material-ui')) {
    try {
      const { create } = require('jss');
      const { jssPreset, StylesProvider } = require('@material-ui/core/styles');

      const insertionPoint = document.createElement('span');

      let jss: any;
      if (jssCache.has(element)) {
        jss = jssCache.get(element);
      } else {
        jss = create({
          ...jssPreset(),
          insertionPoint,
        });
        jssCache.set(element, jss);
      }

      return [<StylesProvider jss={jss}>{app}</StylesProvider>, insertionPoint];
    } catch (err) {
      console.error('Could not load Material-UI. Did you remember to install material-ui/core?');
    }
  }
};

export default materialUiPlugin;
