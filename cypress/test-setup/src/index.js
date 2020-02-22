import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const basicTest = new DireflowComponent();
const propsTest = new DireflowComponent();


const direflowProperties = {
  componentTitle: 'Test Setup',
  showTitle: true,
  sampleList: [
    'Item 1',
    'Item 2',
    'Item 3',
  ],
};

basicTest.configure({
  name: 'basic-test',
  useShadow: true,
  properties: direflowProperties,
});

basicTest.create(App);

propsTest.configure({
  name: 'props-test',
  useShadow: true,
  properties: direflowProperties,
});

propsTest.create(App);
