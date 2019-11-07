import PropTypes from 'prop-types';

/**
 * Update proptypes to reflect the types of the properties and attributes
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
