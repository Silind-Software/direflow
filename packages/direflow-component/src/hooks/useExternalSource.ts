import { useState, useEffect } from 'react';

type TSource = {
  [key: string]: {
    state: 'loading' | 'completed';
    callback?: Function | null;
  };
};

declare global {
  interface Window {
    externalSourcesLoaded: TSource;
  }
}

/**
 * Hook into an external source given a path
 * Returns whether the source is loaded or not
 * @param source
 */
const useExternalSource = (source: string) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (window.externalSourcesLoaded[source].state === 'completed') {
      setHasLoaded(true);
      return;
    }

    window.externalSourcesLoaded[source].callback = () => {
      setHasLoaded(true);
    };
  }, []);

  return hasLoaded;
};

export default useExternalSource;
