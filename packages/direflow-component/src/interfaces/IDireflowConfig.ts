export default interface IDireflowConfig {
  direflowMetadata: IDireflowMetadata;
  plugins: IDireflowPlugin[];
}

export interface IDireflowMetadata {
  title: string;
  description: string;
  type: 'direflow-project' | 'direflow-component';
  createVersion: string;
}

export interface IDireflowPlugin {
  name: string;
  options?: any;
}
