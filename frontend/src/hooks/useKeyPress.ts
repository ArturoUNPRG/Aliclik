import { useEffect } from 'react';

export const useKeyPress = (key: string, action: () => void) => {
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === key) action();
    };
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, [key, action]);
};