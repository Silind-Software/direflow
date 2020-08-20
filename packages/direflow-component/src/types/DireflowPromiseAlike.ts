import { type } from 'os';

type DireflowPromiseAlike = { then: (resolve: (element: HTMLElement) => void) => void };

export default DireflowPromiseAlike;
