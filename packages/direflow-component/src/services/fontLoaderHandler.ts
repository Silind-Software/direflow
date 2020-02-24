import WebFont from 'webfontloader';

const loadFonts = (plugins: IDireflowPlugin[] | undefined) => {
  const fontLoaderPlugin = plugins?.find((plugin) => plugin.name === 'font-loader');

  if (fontLoaderPlugin?.options) {
    WebFont.load(fontLoaderPlugin.options);
  }
};

export default loadFonts;
