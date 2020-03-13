import { DireflowComponent } from 'direflow-component';
import App from './test-component/App';

DireflowComponent.createAll([
  {
    component: App,
    configuration: {
      tagname: 'basic-test',
    },
  },
  {
    component: App,
    configuration: {
      tagname: 'props-test',
    },
  },
  {
    component: App,
    configuration: {
      tagname: 'props-test',
    },
  },
  {
    component: App,
    configuration: {
      tagname: 'slot-test',
    },
  },
]);
