/**
 * Update this interface to reflect the types of the properties
 */
export interface IProperties {
  sampleList: string[];
}

/**
 * Update this object with the initial values of the properties
 */
export const properties: IProperties = {
  sampleList: [
    'Create with React',
    'Build as Web Component',
    'Use it anywhere!',
  ],
};

/**
 * Update this interface to reflect the attributes of the Web Component
 */
export interface IAttributes {
  componentTitle: string;
}

/**
 * Update this object with the initial values of the attributes
 */
export const attributes: IAttributes = {
  componentTitle: '%name-title%',
};
