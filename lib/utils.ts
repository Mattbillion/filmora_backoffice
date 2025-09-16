/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPath } from '@interpriz/lib/utils';
import { ColumnFiltersState } from '@tanstack/react-table';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export * from '@interpriz/lib/utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ensureStartsWith = (
  stringToCheck: string = '',
  startsWith: string,
) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export type QueryParams = Record<
  string,
  | string
  | number
  | boolean
  | Array<string | number | boolean>
  | null
  | undefined
>;

export function qsToObj(queryString: string = '') {
  const cleanQuery = queryString.startsWith('?')
    ? queryString.slice(1)
    : queryString.includes('?')
      ? queryString.split('?')[1]
      : queryString;

  if (isPath(cleanQuery) || !queryString) return {};

  return cleanQuery.split('&').reduce((acc: Record<string, any>, pair) => {
    const [key, value] = pair.split('=');
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    if (decodedKey.endsWith('[]')) {
      const arrayKey = decodedKey.slice(0, -2);
      if (!acc[arrayKey]) acc[arrayKey] = [];
      acc[arrayKey].push(decodedValue);
    } else if (decodedKey === 'filters') {
      decodedValue.split(',').forEach((p) => {
        const [k, v] = p.split('=');
        if (!acc.filters) acc.filters = {};
        if (k && v) acc.filters[k] = v;
      });
    } else {
      acc[decodedKey] = decodedValue;
    }

    return acc;
  }, {});
}

export class ValidationError extends Error {
  constructor(public errors: z.ZodFormattedError<any>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  input: FormData | Record<string, unknown>,
): T {
  const data =
    input instanceof FormData ? Object.fromEntries(input.entries()) : input;

  const result = schema.safeParse(data);

  if (result.success) return result.data;
  throw new ValidationError(result.error.format());
}

export const INITIAL_PAGINATION = {
  total: 0,
  pageCount: 0,
  start: 0,
  limit: 0,
  nextPage: 0,
  prevPage: 0,
};

export function extractActionError(e: Error): {
  message: string;
  errObj?: Record<string, { _errors: string[] }>;
} {
  try {
    const { _errors, ...errObj } = JSON.parse(e.message);
    return { message: (Object.values(errObj)[0] as any)?._errors?.[0], errObj };
  } catch {
    return { message: e.message, errObj: undefined };
  }
}

export function stringifyError(error: Error & { error?: string }) {
  if (error instanceof ValidationError)
    throw new Error(JSON.stringify(error.errors));
  throw new Error(error?.error ?? error?.message ?? String(error));
}

export const imageResize = (
  src: string = '',
  size?: 'medium' | 'small' | 'large',
) => {
  const sizePattern = /\/public\/(small|medium|large)\//i;
  const insertSizePattern = /\/public\/([^/]+)$/i;

  if (!size) return src;
  if (sizePattern.test(src))
    return src.replace(sizePattern, `/public/${size}/`);

  return src.replace(insertSizePattern, `/public/${size}/$1`);
};

export function serializeColumnsFilters(filters: ColumnFiltersState): string {
  return filters.map((f) => `${f.id}=${f.value as string}`).join(',');
}
