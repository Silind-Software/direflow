import WebFont from 'webfontloader';
import { getDireflowPlugin } from '../utils/direflowConfigExtrator';

let didLoadOnce = false;

const loadFonts = () => {
  if (didLoadOnce) {
    return;
  }

  const fontLoaderPlugin = getDireflowPlugin('font-loader');

  if (fontLoaderPlugin?.options) {
    WebFont.load(fontLoaderPlugin.options);
  }

  didLoadOnce = true;
}

export default loadFonts;
