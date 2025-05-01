/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { auth, signOut } from '@/app/(auth)/auth';

import {
  clearObj,
  ensureStartsWith,
  isObject,
  objToQs,
  QueryParams,
} from '../utils';

const domain = process.env.XOOX_DOMAIN;

if (!domain) {
  throw new Error('XOOX_DOMAIN is not set or invalid');
}

type FetchResult<T> = {
  body: T;
  error: string | null;
};

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData;
  searchParams?: QueryParams;
};

type ErrorType = {
  loc: (string | number)[];
  msg: string;
  type: string;
}[];

export async function xooxFetch<
  T extends object & {
    detail?: ErrorType;
    error?: string;
    success?: boolean;
    message?: string;
    data?: any;
    status?: string;
    total_count?: number;
  },
>(url: string, options: FetchOptions = {}): Promise<FetchResult<T>> {
  let opts = { ...options };
  try {
    const headers = new Headers(options.headers);

    if (!headers.has('Authorization')) {
      // careful!!!
      const session = await auth();
      if (!!session?.user?.id)
        headers.set('Authorization', `Bearer ${session?.user?.id}`);
      if (!opts.searchParams) opts.searchParams = {};

      opts.searchParams.company_id = session?.user?.company_id;
    }

    const { endpoint, fetchOptions } = genFetchParams(url, {
      cache: 'force-cache',
      ...opts,
      headers,
    });

    const response = await fetch(endpoint, fetchOptions);
    const body: T = await response.json();

    if (!response.ok || body?.status !== 'success')
      throw new Error(
        body?.detail?.[0]?.msg ||
          body?.error ||
          (body as any)?.message ||
          (typeof body?.detail === 'string' ? body?.detail : undefined) ||
          String(response.status),
      );

    return {
      body,
      error: null,
    };
  } catch (error: any) {
    console.error('url: ', url);
    console.error('Fetch options: ', JSON.stringify(opts, null, 2));
    console.error(
      `Fetch error: `,
      error instanceof Error ? error.message : String(error),
    );
    const errString: string = error?.error ?? error?.message ?? String(error);

    if (errString.toLocaleLowerCase().includes('хүчингүй токен'))
      return signOut();
    throw new Error(errString);
  }
}

function genFetchParams(url: string, options: FetchOptions = {}) {
  let endpoint = `${domain}/dashboard${ensureStartsWith(url, '/')}`;
  const headers = new Headers(options.headers);

  const isBodyObject = isObject(options.body);

  if (!isBodyObject)
    headers.delete('Content-Type'); // Content-Type will be generated automatically by fetch
  else if (!headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json'); // Forced Content-Type

  const fetchOptions: FetchOptions = {
    ...options,
    headers,
  };

  if (isBodyObject) {
    fetchOptions.body = JSON.stringify(clearObj(options.body)) as any;
  }

  fetchOptions.credentials = 'include';
  fetchOptions.mode = 'cors';
  fetchOptions.redirect = 'follow';
  fetchOptions.referrerPolicy = 'no-referrer';

  if (
    typeof options.searchParams === 'object' &&
    Object.values(options.searchParams || {}).length
  ) {
    endpoint += `?${objToQs(clearObj(options.searchParams))}`;
  }

  return { endpoint, fetchOptions: fetchOptions as RequestInit };
}
