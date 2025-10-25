'use server';

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  StreamDetailResponse,
  StreamResponse,
  StreamSearchParams,
} from '@/lib/cloudflare/type';
import { objToQs } from '@/lib/utils';

const cfInfo = () => {
  const [accId, tkn] = [
    process.env.CLOUDFLARE_ACCOUNT_ID,
    process.env.CLOUDFLARE_AUTHORIZATION,
  ];

  if (!accId || !tkn) throw new Error('Missing Cloudflare credentials');

  return {
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${accId}/stream`,
    defaultHeader: {
      Authorization: `Bearer ${tkn}`,
      'Content-Type': 'application/json',
    },
    accId,
  };
};

export async function fetchSignedToken(videoId: string, expiration = 3600) {
  const { defaultHeader, baseURL } = cfInfo();

  const res = await fetch(`${baseURL}/${videoId}/token`, {
    method: 'POST',
    headers: defaultHeader,
    body: JSON.stringify({ expiration }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.errors?.[0]?.message || 'Failed');

  return data.result.token;
}

export async function fetchStreamDetail(streamId: string) {
  const { defaultHeader, baseURL } = cfInfo();

  try {
    const response = await fetch(`${baseURL}/${streamId}`, {
      method: 'GET',
      headers: defaultHeader,
      cache: 'no-store', // or use Next.js revalidate
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: StreamDetailResponse = await response.json();

    return {
      video: data.result,
      success: data.success,
      errors: data.errors,
    };
  } catch (error) {
    console.error('Error fetching Stream detail:', error);
    throw error;
  }
}

export async function fetchStream(params: StreamSearchParams = {}) {
  const { defaultHeader, baseURL } = cfInfo();

  // @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete params.include_counts;

  const sp = objToQs(params as any);

  const url = `${baseURL}${sp && '?'}${sp}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: defaultHeader,
      cache: 'no-store', // or use Next.js revalidate
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: StreamResponse = await response.json();

    // Extract the last video's created date as cursor for next page
    const lastVideo = data.result[data.result.length - 1];
    const nextCursor = lastVideo?.created;

    return {
      videos: data.result,
      nextCursor, // Use the last video's created date as cursor
      hasMore: data.range ? data.range > 0 : data.result.length > 0,
      total: data.total ?? data.result.length,
      range: data.range,
      success: data.success,
      errors: data.errors,
    };
  } catch (error) {
    console.error('Error fetching Stream videos:', error);
    throw error;
  }
}
