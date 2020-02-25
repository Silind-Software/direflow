import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const direflowProperties = {
  componentTitle: '{{names.title}}',
  sampleList: [
    'Create with React',
    'Build as Web Component',
    'Use it anywhere!',
  ],
};

const direflowPlugins = [
  {
    name: 'font-loader',
    options: {
      google: {
        families: ['Advent Pro', 'Noto Sans JP'],
      },
    },
  },
];

const direflowConfiguration = {
  tagname: '{{names.snake}}',
}

DireflowComponent.create({
  component: App,
  configuration: direflowConfiguration,
  properties: direflowProperties,
  plugins: direflowPlugins,
});
