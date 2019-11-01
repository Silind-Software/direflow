import DireflowComponent from 'direflow-component';
import { componentAttributes, componentProperties } from './componentProperties';
import App from './App';

DireflowComponent.setAttributes(componentAttributes);
DireflowComponent.setProperties(componentProperties);
DireflowComponent.render(App, '%name-snake%');
