import React from 'react';
import uniqueid from 'lodash.uniqueid';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const jssCache = new WeakMap<Element, any>();

const muiPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => {
  if (plugins?.find((plugin) => plugin.name === 'mui')) {
    try {
      const { create } = require('jss');
      const { jssPreset, StylesProvider, createGenerateClassName } = require('@mui/material/styles');
      const seed = uniqueid(`${element.tagName.toLowerCase()}-`);
      const insertionPoint = document.createElement('span');
      insertionPoint.id = 'direflow_mui-styles';

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

      return [
        <StylesProvider
          jss={jss}
          sheetsManager={new Map()}
          generateClassName={createGenerateClassName({ seed })}
        >
          {app}
        </StylesProvider>,
        insertionPoint,
      ];
    } catch (err) {
      console.error('Could not load MUI. Did you remember to install @mui/material?');
    }
  }
};

export default muiPlugin;
