import React from 'react'
import { IDireflowPlugin } from '../types/DireflowConfig';

const handleMaterialUiStyle = (app: React.FC<any> | React.ComponentClass<any, any>, plugins: IDireflowPlugin[] | undefined)
    : { mountPoint?: Element, app: React.FC<any> | React.ComponentClass<any, any> } => {

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
                insertionPoint: mountPoint
            });

            return { mountPoint, app: (<StylesProvider jss={jss}>{app}</StylesProvider>) };
        } catch(err) {
            console.error("Could not load Material-UI, not using them...", err);
            return { app };
        }
    }
    else {
        return { app };
    }
};

export default handleMaterialUiStyle;
