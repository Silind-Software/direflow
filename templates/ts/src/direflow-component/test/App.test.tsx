import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App from '../App';
import {
  properties,
  attributes,
} from '../properties';

const reactProps = { ...attributes, ...properties };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App {...reactProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('matches snapshot as expected', () => {
  const renderTree = renderer.create(<App {...reactProps} />).toJSON();
  expect(renderTree).toMatchSnapshot();
});
