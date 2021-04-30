export interface IDireflowComponent {
  component: (React.FC<any> | React.ComponentClass<any, any>) & { [key: string]: any };
  configuration: IDireflowConfig;
  properties?: any;
  plugins?: IDireflowPlugin[];
}

export interface IDireflowConfig {
  tagname: string;
  useShadow?: boolean;
  useAnonymousSlot?: boolean;
}

export interface IDireflowPlugin {
  name: string;
  options?: any;
}
