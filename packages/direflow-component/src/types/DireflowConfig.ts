export interface IDireflowComponent {
  component: React.FC<any> | React.ComponentClass<any, any>;
  configuration: IDireflowConfig;
  properties?: any;
  plugins?: IDireflowPlugin[];
}

export interface IDireflowConfig {
  filename: string;
  tagname: string;
  useShadow?: boolean;
}

export interface IDireflowPlugin {
  name: string;
  options?: any;
}
