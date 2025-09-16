'use server';

import { FetchOptions } from '@interpriz/lib/services';
import { revalidatePath, revalidateTag } from 'next/cache';

import { auth } from '@/app/(auth)/auth';

import { ExtendedFetchClient } from './fetch-client';

const apiServer = new ExtendedFetchClient({
  getAuthToken: async () => {
    const session = await auth();
    const accessToken = (session?.user as any)?.access_token as string | null;
    return accessToken ?? null;
  },
});

export async function get<T>(
  url: string,
  options: Omit<FetchOptions, 'body'> = {},
) {
  return await apiServer.get<T>(url, { cache: 'force-cache', ...options });
}

export async function request<T>(url: string, options?: FetchOptions) {
  return await apiServer.request<T>(url, options);
}

export async function post<T>(url: string, body: any, options?: FetchOptions) {
  return await apiServer.post<T>(url, body, options);
}

export async function put<T>(url: string, body: any, options?: FetchOptions) {
  return await apiServer.put<T>(url, body, options);
}

export async function patch<T>(url: string, body: any, options?: FetchOptions) {
  return await apiServer.patch<T>(url, body, options);
}

export async function destroy<T>(url: string, options?: FetchOptions) {
  return await apiServer.delete<T>(url, options);
}

export async function revalidate(tagName: string) {
  revalidateTag(tagName);
}

export async function revalidateLocal() {
  revalidatePath('/', 'layout');
}

export async function revalidateClient(origin: 'vercel' | 'filmora') {
  const url = {
    vercel:
      process.env.FRONT_VERCEL_DOMAIN || 'https://filmora-client.vercel.app',
    filmora: process.env.FRONT_DOMAIN || 'https://filmora.mn',
  }[origin];

  const endpoint = `${url}/api/revalidate?secret=ps_ez&path=/`;
  try {
    const res = await fetch(endpoint, { method: 'POST', cache: 'no-store' });
    const result = await res.json();

    if (!res.ok) throw new Error('Something went wrong:' + result.message);
    return { result };
  } catch (err) {
    console.error('Revalidation url:', endpoint);
    console.error('Revalidation error:', err);
  }
}
