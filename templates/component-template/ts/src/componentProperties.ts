/**
 * Update this interface to reflect the types of the properties
 */
export interface IComponentProperties {
  todos: string[];
}

/**
 * Update this object with the initial values of the properties
 */
export const componentProperties: IComponentProperties = {
  todos: [
    'Go to src/componentProperties.ts...',
    'Register properties and attributes...',
    'Build awesome React Web Component!',
  ],
};

/**
 * Update this interface to reflect the attributes of the Web Component
 */
export interface IComponentAttributes {
  componentTitle: string;
}

/**
 * Update this object with the initial values of the attributes
 */
export const componentAttributes: IComponentAttributes = {
  componentTitle: '%name-title%',
};
