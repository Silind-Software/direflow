import DireflowComponent from 'direflow-component';
import { attributes, properties } from './direflow-component/properties';
import App from './direflow-component/App';

const direflowComponent = new DireflowComponent();

direflowComponent.setAttributes(attributes);
direflowComponent.setProperties(properties);
direflowComponent.render(App, '%name-snake%');
