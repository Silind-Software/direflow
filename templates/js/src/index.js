import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

DireflowComponent.create({
  component: App,
  configuration: {
    tagname: '{{names.snake}}',
  },
  plugins: [
    {
      name: 'font-loader',
      options: {
        google: {
          families: ['Advent Pro', 'Noto Sans JP'],
        },
      },
    },
  ],
});
