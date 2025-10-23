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
  src: string,
  size: 'original' | 'tiny' | 'small' | 'medium' = 'original',
) => src.replace(/_(.*?)\.webp/g, () => `_${size}.webp`);

export function serializeColumnsFilters(filters: ColumnFiltersState): string {
  return filters.map((f) => `${f.id}=${f.value as string}`).join(',');
}

export function humanizeBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1,
  );

  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(dm)} ${sizes[i]}`;
}
