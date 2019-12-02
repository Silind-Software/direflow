import DireflowComponent from 'direflow-component';
import { attributes, properties } from './properties';
import App from './App';

DireflowComponent.setAttributes(attributes);
DireflowComponent.setProperties(properties);
DireflowComponent.render(App, '%name-snake%');
