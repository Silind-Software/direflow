import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const direflowComponent = new DireflowComponent();

direflowComponent.setProperties({
  componentTitle: '%name-title%',
  sampleList: [
    'Create with React',
    'Build as Web Component',
    'Use it anywhere!',
  ],
});

direflowComponent.render(App, '%name-snake%');
