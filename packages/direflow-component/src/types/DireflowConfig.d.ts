interface IDireflowConfig {
  name: string;
  useShadow: boolean;
  properties?: any;
  plugins?: IDireflowPlugin[];
}

interface IDireflowPlugin {
  name: string;
  options?: any;
}
