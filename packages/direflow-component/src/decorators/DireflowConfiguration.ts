function DireflowConfiguration(config: Partial<IDireflowComponent>) {
  return <T extends React.ComponentClass<any, any>>(constructor: T & Partial<IDireflowComponent>) => {
    const decoratedConstructor = constructor;

    decoratedConstructor.configuration = config.configuration;
    decoratedConstructor.properties = config.properties;
    decoratedConstructor.plugins = config.plugins;

    return decoratedConstructor;
  };
}

export default DireflowConfiguration;
