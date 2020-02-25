interface IDireflowComponent {
  component: React.FC<any> | React.ComponentClass<any, any>;
  configuration: IDireflowConfig;
  properties?: any;
  plugins?: IDireflowPlugin[];
}

interface IDireflowConfig {
  filename: string;
  tagname: string;
  useShadow?: boolean;
}

interface IDireflowPlugin {
  name: string;
  options?: any;
}
