/*!
 * Begin implementing the surrounding logic for your Direflow Components here.
 * The following code is just an example, and everything here can be safely removed.
 *
 * Happy hacking! :)
*/
import { registerComponent } from 'direflow-project';

registerComponent('cool-component')
  .onMount((component) => handleComponent(component))
  .onFail((err) => console.warn(err));

const handleComponent = (component) => {
  component.todos = [
    'Build a cool Web Component',
    'Deploy the Web Component',
    'Share it and use it',
  ];

  component.addEventListener('my-event', () => console.log('Alright! Very cool 😎'));
};
