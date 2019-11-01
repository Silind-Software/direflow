/*!
 * Begin implementing the surrounding logic for your Direflow Components here.
 * The following code is just an example, and everything here can be safely removed.
 *
 * Happy hacking! :)
*/
import { registerComponent } from 'direflow-project';

/**
 * Example code:
 * - Register a widget named "cool-component"
 * - Call 'handleComponent' when widget is mounted to the DOM and pass the widget
 * - Display warning message with an error if something goes wrong
 * @param widget Custom Element
 */
registerComponent('cool-component')
  .onMount((component) => handleComponent(component))
  .onFail((err) => console.warn(err));

/**
 * Example code:
 * - Set a couple of properties
 * - Listen to an event
 * @param component Custom Element
 */
const handleComponent = (component) => {
  component.todos = [
    'Build a cool Web Component',
    'Deploy the Web Component',
    'Share it and use it',
  ];

  component.addEventListener('my-event', () => console.log('Alright! Very cool 😎'));
};
