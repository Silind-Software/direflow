import { IDireflowPlugin } from '../types/DireflowConfig';
import asyncScriptLoader from './asyncScriptLoader';

type TWcPolyfillsLoaded = Array<{ script: Element; hasLoaded: boolean }>;
declare global {
  interface Window {
    wcPolyfillsLoaded: TWcPolyfillsLoaded;
  }
}

let didIncludeOnce = false;

const DEFAULT_SD = 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-sd.js';
const DEFAULT_CE = 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.4.1/bundles/webcomponents-ce.js';
const DEFAULT_AD = 'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.4.1/custom-elements-es5-adapter.js';

const includePolyfills = async (
  options: { usesShadow: boolean },
  plugins: IDireflowPlugin[] | undefined,
) => {
  if (didIncludeOnce) {
    return;
  }
  const scriptsList = [];

  let useSD = '';
  let useCE = '';
  let useAD = '';

  const polyfillLoaderPlugin = plugins?.find((plugin) => plugin.name === 'polyfill-loader');

  if (polyfillLoaderPlugin) {
    console.warn(
      'polyfill-loader plugin is deprecated. Use direflow-config.json instead.' + '\n' +
      'See more: https://direflow.io/configuration',
    );
  }

  const polyfillSD = process.env.DIREFLOW_SD ?? polyfillLoaderPlugin?.options?.use.sd;
  const polyfillCE = process.env.DIREFLOW_CE ?? polyfillLoaderPlugin?.options?.use.ce;
  const polyfillAdapter = process.env.DIREFLOW_ADAPTER ?? polyfillLoaderPlugin?.options?.use.adapter;

  const disableSD = polyfillSD === false;
  const disableCE = polyfillCE === false;
  const disableAD = polyfillAdapter === false;

  if (polyfillSD) {
    useSD = typeof polyfillSD === 'string'
      ? polyfillSD
      : DEFAULT_SD;
  }

  if (polyfillCE) {
    useCE = typeof polyfillCE === 'string'
      ? polyfillCE
      : DEFAULT_CE;
  }

  if (polyfillAdapter) {
    useAD = typeof polyfillAdapter === 'string'
      ? polyfillAdapter
      : DEFAULT_AD;
  }

  if (options.usesShadow && !disableSD) {
    scriptsList.push(asyncScriptLoader(useSD || DEFAULT_SD, 'wcPolyfillsLoaded'));
  }

  if (!disableCE) {
    scriptsList.push(asyncScriptLoader(useCE || DEFAULT_CE, 'wcPolyfillsLoaded'));
  }

  if (!disableAD) {
    scriptsList.push(asyncScriptLoader(useAD || DEFAULT_AD, 'wcPolyfillsLoaded'));
  }

  try {
    await Promise.all(scriptsList);
    didIncludeOnce = true;
  } catch (error) {
    console.error(error);
  }
};

export default includePolyfills;
