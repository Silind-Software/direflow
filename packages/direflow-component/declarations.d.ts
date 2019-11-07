declare module 'style-it';

declare module 'react-shadow';

declare module 'config-overrides';

declare module 'event-hooks-webpack-plugin';

declare module 'html-webpack-externals-plugin';

declare module 'event-hooks-webpack-plugin/lib/tasks';

declare module 'webpack-filter-warnings-plugin';

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
