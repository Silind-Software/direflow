import React from "react";
import { IDireflowPlugin } from "../types/DireflowConfig";
import { PluginRegistrator } from "../types/PluginRegistrator";

const muiCacheCache = new WeakMap<Element, any>();

const materialUi5Plugin: PluginRegistrator = (
  element: HTMLElement,
  plugins: IDireflowPlugin[] | undefined,
  app?: JSX.Element
) => {
  if (plugins?.find(plugin => plugin.name === "material-ui5")) {
    try {
      const createCache = require("@emotion/cache").default;
      const { CacheProvider } = require("@emotion/react");
      const { StyledEngineProvider } = require("@mui/material");

      const seed = `${element.tagName.toLowerCase()}`;
      const insertionPoint = document.createElement("span");
      insertionPoint.id = "direflow_material-ui-styles";

      let muiCache: any;
      if (muiCacheCache.has(element)) {
        muiCache = muiCacheCache.get(element);
      } else {
        muiCache = createCache({
          key: seed,
          prepend: true,
          container: insertionPoint
        });

        muiCacheCache.set(element, muiCache);
      }

      return [
        // eslint-disable-next-line react/jsx-key
        <StyledEngineProvider>
          <CacheProvider value={muiCache}>{app}</CacheProvider>
        </StyledEngineProvider>,
        insertionPoint
      ];
    } catch (err) {
      console.error(
        "Could not load Material-UI. Did you remember to install @mui/material, @emotion/cache and @emotion/react?"
      );
    }
  }
};

export default materialUi5Plugin;
