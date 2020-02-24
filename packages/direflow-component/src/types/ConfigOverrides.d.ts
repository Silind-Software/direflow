interface IOptions {
  filename?: string;
  chunkFilename?: string;
}

interface IModule {
  rules: {
    oneOf: {
      test: RegExp;
      use: string[];
    }[];
  }[];
}

interface IOutput {
  filename: string;
  chunkFilename: string;
}

interface IOptimization {
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

interface IPlugin {
  options: {
    inject: string;
  };
}

interface IResolve {
  plugins: unknown[];
}

type TConfig = {
  [key: string]: unknown;
  entry: string[];
  module: IModule;
  output: IOutput;
  optimization: IOptimization;
  plugins: IPlugin[];
  resolve: IResolve;
};
