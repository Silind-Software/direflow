export interface IOptions {
  filename?: string;
  chunkFilename?: string;
  react?: string | boolean;
  reactDOM?: string | boolean;
}

export interface IModule {
  rules: {
    oneOf: {
      test: RegExp;
      use: string[];
    }[];
  }[];
}

export interface IOutput {
  filename: string;
  chunkFilename: string;
}

export interface IOptimization {
  minimizer: {
    options: {
      sourceMap: boolean;
    };
  }[];
  runtimeChunk: boolean;
  splitChunks: boolean | {
    cacheGroups: {
      vendor: {
        test: RegExp;
        chunks: string;
        name: string;
        enforce: boolean;
      };
    };
  };
}

export interface IPlugin {
  options: {
    inject: string;
  };
}

export interface IResolve {
  plugins: unknown[];
}

export type TEntry = string[] | { [key: string]: string };

export type TConfig = {
  [key: string]: unknown;
  entry: TEntry;
  module: IModule;
  output: IOutput;
  optimization: IOptimization;
  plugins: IPlugin[];
  resolve: IResolve;
  externals: { [key: string]: any };
};
