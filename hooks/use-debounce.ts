'use client';
import { useEffect } from 'react';

export const useDebounce = <T>(
  fn: (val: T) => void,
  delay: number,
  value: T,
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      fn(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value]);
};
