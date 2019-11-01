import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from '../App';
import {
  componentProperties,
  componentAttributes,
} from '../componentProperties';

const reactProps = { ...componentAttributes, ...componentProperties };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App {...reactProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('matches snapshot as expected', () => {
  const renderTree = renderer.create(<App {...reactProps} />).toJSON();
  expect(renderTree).toMatchSnapshot();
});
