'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQueryString<T extends Record<string, any>>(
  initialValues?: T,
) {
  const sp = useSearchParams();

  const qsObj = useMemo(
    () =>
      Object.assign(
        initialValues || {},
        Array.from(sp.entries()).reduce(
          (acc: Record<string, string | string[]>, [k, v]) => ({
            ...acc,
            [k]: acc[k] ? [...acc[k], v] : v,
          }),
          {},
        ) || {},
      ) as T,
    [sp],
  );

  return qsObj;
}
