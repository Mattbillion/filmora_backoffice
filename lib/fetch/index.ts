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

const domain = process.env.FILMORA_DOMAIN;

if (!domain) {
  throw new Error('FILMORA_DOMAIN is not set or invalid');
}

type FetchResult<T> = {
  body: T;
  error: string | null;
};

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData;
  searchParams?: QueryParams;
  syncTable?: string;
};

type ErrorType = {
  loc: (string | number)[];
  msg: string;
  type: string;
}[];

export async function filmoraFetch<
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

      if (opts.method === 'GET') {
        opts.searchParams.company_id = session?.user?.company_id;
        // opts.searchParams.com_id = session?.user?.company_id;
      }
    }

    const { endpoint, fetchOptions } = genFetchParams(url, {
      cache: 'no-store',
      ...opts,
      headers,
    });

    const response = await fetch(endpoint, fetchOptions);
    const body: T = await response.json();
    if (options.syncTable) esSync(options.syncTable);

    if (!response.ok || body?.status !== 'success') {
      const propperError = body?.detail?.[0]?.msg;
      let errorMsg = '';

      if (propperError)
        errorMsg = propperError + `: ${body?.detail?.[0]?.loc?.join('.')}`;
      else
        errorMsg =
          body?.error ||
          (body as any)?.message ||
          (typeof body?.detail === 'string' ? body?.detail : undefined) ||
          String(response.status);

      throw new Error(errorMsg);
    }

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
    return {
      body: {} as unknown as T,
      error: errString,
    };
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

const esSync = async (tableName: string) => {
  try {
    await fetch(
      `${process.env.FILMORA_DOMAIN || process.env.NEXT_PUBLIC_FILMORA_DOMAIN}/client/dbsync?table_name=${tableName}`,
    );
  } catch (error) {
    console.error('dbsync error', error);
  }
};
