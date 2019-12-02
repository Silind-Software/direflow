import { registerComponent, IDireflowComponent } from 'direflow-project';

registerComponent('cool-component')
  .onMount((component: IDireflowComponent) => handleComponent(component))
  .onFail((err: string) => console.warn(err));

const handleComponent = (component: IDireflowComponent): void => {
  component.sampleList = [
    'Create',
    'Build',
    'Share',
  ],

  component.addEventListener('my-event', () => {
    console.log(`${component.componentTitle} dispatched an event...`);
  });
};
