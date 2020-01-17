/// <reference types="react-scripts" />

declare module '*.css' {
  const classes: string
  export default classes
}

declare module '*.scss' {
  const classes: string
  export default classes
}

declare module '*.sass' {
  const classes: string
  export default classes
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}
