/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, signOut } from "@/app/(auth)/auth";
import { clearObj, ensureStartsWith, objToQs, QueryParams } from "../utils";

const domain = process.env.GOODALI_DOMAIN
  ? ensureStartsWith(process.env.GOODALI_DOMAIN, "https://")
  : "";

if (!domain) {
  throw new Error("GOODALI_DOMAIN is not set or invalid");
}


type FetchResult<T> = {
  body: T;
  error: string | null;
};

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown>;
  searchParams?: QueryParams;
};

export async function goodaliFetch<T extends object & Partial<{error?: string; success?: boolean; message?: boolean; data?: any; status?: number}>>(url: string, options: FetchOptions = {}): Promise<FetchResult<T>> {
  try {
    const session = await auth();

    const headers = new Headers(options.headers);

    if (!!session?.user?.id && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${session?.user?.id}`);

    const {endpoint, fetchOptions} = genFetchParams(url, {cache: 'force-cache', ...options, headers});

    const response = await fetch(endpoint, fetchOptions);
    const body: T = await response.json();

    if (!response.ok) throw new Error(body?.error || (body as any)?.message || String(response.status));

    return {
      body,
      error: null,
    };
  } catch (error: any) {
    console.error("url: ", url);
    console.error("Fetch options: ", JSON.stringify(options, null, 2));
    console.error(`Fetch error: `, error instanceof Error ? error.message : String(error));
    const errString: string = error?.error ?? error?.message ?? String(error);

    if(errString.toLocaleLowerCase().includes('jwt expired')) return signOut();
    throw new Error(errString);
  }
}

function genFetchParams(url: string, options: FetchOptions = {}){
  let endpoint = `${domain}/admin${ensureStartsWith(url, "/")}`;
  const isBodyJSON = options.body && typeof options.body === 'object';

  const headers = new Headers(options.headers);

  if (isBodyJSON && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const fetchOptions: FetchOptions = {
    ...options,
    headers,
  };

  if (isBodyJSON) {
    fetchOptions.body = JSON.stringify(clearObj(options.body)) as any;
  }

  fetchOptions.credentials = 'include'
  fetchOptions.mode = 'cors'
  fetchOptions.redirect = 'follow'
  fetchOptions.referrerPolicy = 'no-referrer'

  if (typeof options.searchParams === "object" && Object.values(options.searchParams || {}).length) {
    endpoint += `?${objToQs(clearObj(options.searchParams))}`;
  }

  return {endpoint, fetchOptions: fetchOptions as RequestInit};
}