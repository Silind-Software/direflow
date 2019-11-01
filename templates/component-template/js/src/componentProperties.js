/*!
* Use the two objects below to register the properties and attributes the 
* Web Component is expected to receive.
* These will be passed down as props to the React App underneath.
*/
import PropTypes from 'prop-types';

/**
 * Update proptypes to reflect the types of the properties and attributes
* NB: The type of an attribute must be primitive
 */
export const propTypes = {
  todos: PropTypes.array,
  componentTitle: PropTypes.string,
};

/**
 * Update this object with the initial values of the properties
 */
export const componentProperties = {
  todos: [
    'Go to src/componentProperties.ts...',
    'Register properties and attributes...',
    'Build awesome React Web Component!',
  ],
};

/**
 * Update this object with the initial values of the attributes
 */
export const componentAttributes = {
  componentTitle: '%name-title%',
};
