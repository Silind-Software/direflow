import { registerComponent } from 'direflow-project';

registerComponent('cool-component')
  .onMount((component) => handleComponent(component))
  .onFail((err) => console.warn(err));

const handleComponent = (component) => {
  component.sampleList = [
    'Create',
    'Build',
    'Share',
  ],

  component.addEventListener('my-event', () => {
    console.log(`${component.componentTitle} dispatched an event...`);
  });
};
