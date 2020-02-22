import { DireflowComponent } from 'direflow-component';
import App from './test-component/App';

const basicTest = new DireflowComponent();
const propsTest = new DireflowComponent();
const eventTest = new DireflowComponent();

const direflowProperties = {
  componentTitle: 'Test Setup',
  showTitle: true,
  sampleList: ['Item 1', 'Item 2', 'Item 3'],
};

basicTest.configure({
  name: 'basic-test',
  useShadow: true,
  properties: direflowProperties,
});

propsTest.configure({
  name: 'props-test',
  useShadow: true,
  properties: direflowProperties,
});

eventTest.configure({
  name: 'event-test',
  useShadow: true,
  properties: direflowProperties,
});

basicTest.create(App);
propsTest.create(App);
eventTest.create(App);
