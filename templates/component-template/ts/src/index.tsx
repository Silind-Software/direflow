import DireflowComponent from 'direflow-component';
import { attributes, properties } from './properties';
import App from './App';

const direflowComponent = new DireflowComponent();

direflowComponent.setAttributes(attributes);
direflowComponent.setProperties(properties);
direflowComponent.render(App, '%name-snake%');
