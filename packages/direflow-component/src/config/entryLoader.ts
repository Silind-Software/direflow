import asyncScriptLoader from '../services/asyncScriptLoader';

let didIncludeReactOnce = false;

const includeReact = async () => {
  if (didIncludeReactOnce) {
    return;
  }

  try {
    await asyncScriptLoader(
      'https://unpkg.com/react@16/umd/react.production.min.js',
      window.reactBundleLoaded,
    );
    await asyncScriptLoader(
      'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
      window.reactBundleLoaded,
    );
    didIncludeReactOnce = true;
  } catch (error) {
    console.error(error);
  }
};

const includeIndex = () => {
  try {
    require('../../../../src/index.js');
  } catch (error) {
    // Ignore if file doens't exits
  }

  try {
    require('../../../../src/index.tsx');
  } catch (error) {
    // Ignore if file doens't exits
  }
};

(async () => {
  if (window.React && window.ReactDOM) {
    includeIndex();
    return;
  }

  await includeReact();

  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.React && window.ReactDOM) {
        clearInterval(interval);
        resolve();
      }
    });
  });

  includeIndex();
})();
