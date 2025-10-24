/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StreamResponse, StreamSearchParams } from '@/lib/cloudflare/type';
import { objToQs } from '@/lib/utils';

export async function fetchStream(params: StreamSearchParams = {}) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_AUTHORIZATION;

  if (!accountId || !apiToken) {
    throw new Error('Missing Cloudflare credentials');
  }

  // @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete params.include_counts;

  const sp = objToQs(params as any);

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream${sp && '?'}${sp}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      // Optional: Add caching strategy
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
