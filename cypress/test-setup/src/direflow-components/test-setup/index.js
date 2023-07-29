import { DireflowComponent } from 'direflow-component';
import App from './App';
import StyledComponent from './StyledComponent';
import MaterialUI from './MaterialUI';

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
      tagname: 'event-test',
    },
  },
  {
    component: App,
    configuration: {
      tagname: 'slot-test',
    },
  },
  {
    component: App,
    configuration: {
      tagname: 'external-loader-test',
    },
    plugins: [
      {
        name: 'external-loader',
        options: {
          paths: [
            'https://code.jquery.com/jquery-3.3.1.slim.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
            {
              src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js',
              async: true,
            },
          ],
        },
      },
    ],
  },
  {
    component: StyledComponent,
    configuration: {
      tagname: 'styled-components-test',
    },
    plugins: [
      {
        name: 'styled-components',
      },
    ],
  },
  {
    component: MaterialUI,
    configuration: {
      tagname: 'material-ui-test',
    },
    plugins: [
      {
        name: 'material-ui',
      },
    ],
  },
]);
