import React from 'react';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const styledComponentsPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => {
  if (plugins?.find((plugin) => plugin.name === 'styled-components')) {
    try {
      const { StyleSheetManager } = require('styled-components');

      const insertionPoint = document.createElement('span');
      insertionPoint.id = 'direflow_styled-components-styles';

      return [<StyleSheetManager target={insertionPoint}>{app}</StyleSheetManager>, insertionPoint];
    } catch (error) {
      console.error(
        'Could not load styled-components. Did you remember to install styled-components?',
      );
    }
  }
};

export default styledComponentsPlugin;
