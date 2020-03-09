/// <reference types="react-scripts" />

declare module '*.css' {
  export default style as string
}

declare module '*.scss' {
  export default style as string
}

declare module '*.sass' {
  export default style as string
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare namespace JSX {
  interface IntrinsicElements {
    'slot';
  }
}
