type TBundle = { script: Element; hasLoaded: boolean };
declare global {
  interface Window {
    wcPolyfillsLoaded: TBundle[];
    reactBundleLoaded: TBundle[];
  }
}

const asyncScriptLoader = (src: string, bundleList: TBundle[] | undefined): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;

    if (!bundleList) {
      bundleList = [];
    }

    const existingPolyfill = bundleList.find((loadedScript) => {
      return loadedScript.script.isEqualNode(script);
    });

    if (existingPolyfill) {
      if (existingPolyfill.hasLoaded) {
        resolve();
      }

      existingPolyfill.script.addEventListener('load', () => resolve());
      return;
    }

    const scriptEntry = {
      script,
      hasLoaded: false,
    };

    bundleList.push(scriptEntry);

    script.addEventListener('load', () => {
      scriptEntry.hasLoaded = true;
      resolve();
    });

    script.addEventListener('error', () => reject(new Error('Polyfill failed to load')));

    document.head.appendChild(script);
  });
};

export default asyncScriptLoader;
