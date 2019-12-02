import PropTypes from 'prop-types';

/**
 * Update proptypes to reflect the types of the properties and attributes
 */
export const propTypes = {
  sampleList: PropTypes.array,
  componentTitle: PropTypes.string,
};

/**
 * Update this object with the initial values of the properties
 */
export const properties = {
  sampleList: [
    'Create',
    'Build',
    'Share',
  ],
};

/**
 * Update this object with the initial values of the attributes
 */
export const attributes = {
  componentTitle: '%name-title%',
};
