/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

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

export const urlRegex = /\/([^/]+)$/;

export type QueryParams = Record<
  string,
  | string
  | number
  | boolean
  | Array<string | number | boolean>
  | null
  | undefined
>;

export function objToQs(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, item.toString());
        }
      });
    } else if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
}

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

export function isUri(str: string) {
  const uriRegex = /^(https?:\/\/|ftp:\/\/|file:\/\/|www\.)/i;
  return uriRegex.test(str);
}

export function isPath(str: string) {
  const pathRegex = /^(\/|\.\/|\.\.\/+$)/;
  return pathRegex.test(str);
}

export function extractActionError(e: Error): {
  message: string;
  errObj?: Record<string, { _errors: string[] }>;
} {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export function currencyFormat(total: number) {
  return String(total).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '₮';
}

export const removeHTML = (str: string = '') =>
  str.replace(/<\/?[^>]+(>|$)|&[^;]+;/g, '');

export const apiImage = (
  src?: string,
  size?: 'medium' | 'small' | 'large' | 'xs' | 'blur',
) => {
  const domain =
    process.env.NEXT_PUBLIC_XOOX_DOMAIN ?? 'http://3.95.231.68:3000/api/v1';
  const sizePattern = /\/static\/img\/uploads\/(small|medium|large|xs|blur)\//i;
  const insertSizePattern = /\/static\/img\/uploads\/([^\/]+)$/i;

  const imgSrc = `${domain}${src?.replace(domain, '') ?? '/static/img/'}`;

  if (!size) return imgSrc;
  if (sizePattern.test(imgSrc))
    return imgSrc.replace(sizePattern, `/static/img/uploads/${size}/`);

  return imgSrc.replace(insertSizePattern, `/static/img/uploads/${size}/$1`);
};

// one line bolgoh hereggvi!!!
export function clearObj(obj: Record<any, any> = {}) {
  const result: Record<any, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) result[key] = obj[key];
  }

  return result;
}

export const isObject = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof FormData);
