import asyncScriptLoader from './asyncScriptLoader';

let didIncludeOnce = false;

const includePolyfills = async (
  options: { usesShadow: boolean },
  plugins: IDireflowPlugin[] | undefined,
) => {
  if (didIncludeOnce) {
    return;
  }

  const polyfillLoaderPlugin = plugins?.find((plugin) => plugin.name === 'polyfill-loader');

  if (polyfillLoaderPlugin) {
    includePolyfillsFromPlugin(polyfillLoaderPlugin);
    return;
  }

  const scriptsList = [];

  if (options.usesShadow) {
    scriptsList.push(
      asyncScriptLoader(
        'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-sd.js',
        window.wcPolyfillsLoaded,
      ),
    );
  }

  scriptsList.push(
    asyncScriptLoader(
      'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-ce.js',
      window.wcPolyfillsLoaded,
    ),
  );

  scriptsList.push(
    asyncScriptLoader(
      'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.1/custom-elements-es5-adapter.js',
      window.wcPolyfillsLoaded,
    ),
  );

  try {
    await Promise.all(scriptsList);
    didIncludeOnce = true;
  } catch (error) {
    console.error(error);
  }
};

let didIncludeOncePlugin = false;

const includePolyfillsFromPlugin = async (plugin: IDireflowPlugin) => {
  if (didIncludeOncePlugin) {
    return;
  }

  const scriptsList = [];

  if (plugin.options?.use.sd) {
    const src =
      typeof plugin.options?.use.sd === 'string'
        ? plugin.options?.use.sd
        : 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-sd.js';

    scriptsList.push(asyncScriptLoader(src, window.wcPolyfillsLoaded));
  }

  if (plugin.options?.use.ce) {
    const src =
      typeof plugin.options?.use.ce === 'string'
        ? plugin.options?.use.ce
        : 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-ce.js';

    scriptsList.push(asyncScriptLoader(src, window.wcPolyfillsLoaded));
  }

  const adapterSrc =
    typeof plugin.options?.use.adapter === 'string'
      ? plugin.options.use.adapter
      : 'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.1/custom-elements-es5-adapter.js';

  scriptsList.push(asyncScriptLoader(adapterSrc, window.wcPolyfillsLoaded));

  try {
    await Promise.all(scriptsList);
    didIncludeOncePlugin = true;
  } catch (error) {
    console.error(error);
  }
};

export default includePolyfills;
