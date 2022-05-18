import registerPlugin from '../helpers/registerPlugin';
import styledComponentsPlugin from './styledComponentsPlugin';
import externalLoaderPlugin from './externalLoaderPlugin';
import fontLoaderPlugin from './fontLoaderPlugin';
import iconLoaderPlugin from './iconLoaderPlugin';
import materialUiPlugin from './materialUiPlugin';
import muiPlugin from './muiPlugin';

const plugins = [
  registerPlugin(fontLoaderPlugin),
  registerPlugin(iconLoaderPlugin),
  registerPlugin(externalLoaderPlugin),
  registerPlugin(styledComponentsPlugin),
  registerPlugin(materialUiPlugin),
  registerPlugin(muiPlugin),
];

export default plugins;
