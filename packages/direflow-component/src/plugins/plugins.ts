import registerPlugin from '../helpers/registerPlugin';
import styledComponentsPlugin from './styledComponentsPlugin';
import externalLoaderPlugin from './externalLoaderPlugin';
import fontLoaderPlugin from './fontLoaderPlugin';
import iconLoaderPlugin from './iconLoaderPlugin';
import materialUiPlugin from './materialUiPlugin';

const plugins = [
  registerPlugin(fontLoaderPlugin),
  registerPlugin(iconLoaderPlugin),
  registerPlugin(externalLoaderPlugin),
  registerPlugin(styledComponentsPlugin),
  registerPlugin(materialUiPlugin)
];

export default plugins;
