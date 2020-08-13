export default interface IDireflowConfig {
  build?: {
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
}
