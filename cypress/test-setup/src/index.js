import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const direflowComponent = new DireflowComponent();

const direflowProperties = {
  componentTitle: 'Test Setup',
  sampleList: [
    'Item 1',
    'Item 2',
    'Item 3',
  ],
};

direflowComponent.configure({
  name: 'test-setup',
  useShadow: true,
  properties: direflowProperties,
});

direflowComponent.create(App);
