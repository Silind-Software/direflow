export default interface IDireflowConfig {
  build?: {
    componentPath?: string;
    filename?: string;
    chunkFilename?: string;
    emitSourceMap?: boolean;
    emitIndexHTML?: boolean;
    emitAll?: boolean;
    split?: boolean;
    vendor?: boolean;
  };
  modules?: {
    react?: string;
    reactDOM?: string;
  };
  polyfills?: {
    sd?: string | boolean;
    ce?: string | boolean;
    adapter: string | boolean;
  };
}
