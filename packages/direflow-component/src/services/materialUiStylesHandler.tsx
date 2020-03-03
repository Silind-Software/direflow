import React from 'react';
import { IDireflowPlugin } from '../types/DireflowConfig';

const handleMaterialUiStyle = (
  app: JSX.Element,
  plugins: IDireflowPlugin[] | undefined,
): { mountPoint?: Element; app: JSX.Element } => {
  if (plugins?.find((plugin) => plugin.name === 'material-ui')) {
    try {
      const jssLib = require('jss');
      const materialUiStyles = require('@material-ui/core/styles');
      const { create } = jssLib;
      const { jssPreset } = materialUiStyles;
      const { StylesProvider } = materialUiStyles;

      const mountPoint = document.createElement('span');

      const jss = create({
        ...jssPreset(),
        insertionPoint: mountPoint,
      });

      return { mountPoint, app: (<StylesProvider jss={jss}>{app}</StylesProvider>) };
    } catch (err) {
      console.error('Could not load Material-UI', err);
      return { app };
    }
  } else {
    return { app };
  }
};

export default handleMaterialUiStyle;
