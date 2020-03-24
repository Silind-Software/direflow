declare module 'style-it';

declare module 'react-shadow';

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
