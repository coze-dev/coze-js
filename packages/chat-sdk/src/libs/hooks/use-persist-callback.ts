import { useCallback, useRef } from 'react';

export const usePersistCallback = <T extends (...args: unknown[]) => unknown>(
  fn: T,
) => {
  const ref = useRef<T>(fn);
  ref.current = fn;
  return useCallback((...args: Parameters<T>) => ref.current(...args), []);
};
