import React from 'react';
import _ from 'lodash';
import { IDireflowPlugin } from '../types/DireflowConfig';
import { PluginRegistrator } from '../types/PluginRegistrator';

const materialUiPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element,
) => {
  if (plugins?.find((plugin) => plugin.name === 'material-ui')) {
    try {

      const { StyledEngineProvider, CssBaseline } = require('@mui/material');
      const { createGenerateClassName } = require('@mui/material/styles');
      const seed = _.uniqueId(`${element.tagName.toLowerCase()}-`);
      const insertionPoint = document.createElement('span');
      insertionPoint.id = 'direflow_material-ui-styles';


      return [
                <StyledEngineProvider injectFirst
                                      sheetsManager={new Map()}
                                      generateClassName={createGenerateClassName({ seed })}
                >
                        <CssBaseline/>
                        {app}
                </StyledEngineProvider>,
                insertionPoint,
      ];
    } catch (err) {
      console.error('Could not load Material-UI. Did you remember to install @material-ui/core?');
    }
  }
};

export default materialUiPlugin;
