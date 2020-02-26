export interface IDireflowConfig {
  name: string;
  useShadow: boolean;
  properties?: any;
  plugins?: IDireflowPlugin[];
}

export interface IDireflowPlugin {
  name: string;
  options?: any;
}
