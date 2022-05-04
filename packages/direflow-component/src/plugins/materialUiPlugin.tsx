import React from "react";
import uniqueid from "lodash.uniqueid";
import { IDireflowPlugin } from "../types/DireflowConfig";
import { PluginRegistrator } from "../types/PluginRegistrator";

const jssCache = new WeakMap<Element, any>();

const materialUiPlugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element
) => {
  if (plugins?.find(plugin => plugin.name === "material-ui")) {
    try {
      console.log("Executing material-ui plugin");
      const { create } = require("jss");
      const {
        jssPreset,
        StylesProvider,
        createGenerateClassName
      } = require("@material-ui/core/styles");
      const seed = uniqueid(`${element.tagName.toLowerCase()}-`);
      const insertionPoint = document.createElement("span");
      insertionPoint.id = "direflow_material-ui-styles";

      let jss: any;
      if (jssCache.has(element)) {
        jss = jssCache.get(element);
      } else {
        jss = create({
          ...jssPreset(),
          insertionPoint
        });
        jssCache.set(element, jss);
      }

      return [
        // eslint-disable-next-line react/jsx-key
        <StylesProvider
          jss={jss}
          sheetsManager={new Map()}
          generateClassName={createGenerateClassName({ seed })}
        >
          {app}
        </StylesProvider>,
        insertionPoint
      ];
    } catch (err) {
      console.error(
        "Could not load Material-UI. Did you remember to install @material-ui/core?"
      );
    }
  }
};

export default materialUiPlugin;
