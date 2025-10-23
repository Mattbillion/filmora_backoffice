import { StreamResponse } from '@/lib/cloudflare/type';

interface PaginationParams {
  after?: string; // Cursor - Lists videos created after the specified date
  before?: string; // Cursor - Lists videos created before the specified date
  asc?: boolean; // Sort order (default: false for desc)
  creator?: string; // A user-defined identifier for the media creator
  end?: string; // Lists videos created before the specified date (format: date-time)
  include_counts?: boolean; // Includes total number of videos with the query parameters
  search?: string; // Partial word match of the 'name' key in the 'meta' field
  start?: string; // Lists videos created after the specified date (format: date-time)
  status?:
    | 'pendingupload'
    | 'downloading'
    | 'queued'
    | 'inprogress'
    | 'ready'
    | 'error'
    | 'live-inprogress';
  type?: 'vod' | 'live'; // Filter by video type
  video_name?: string; // Fast
}

export async function fetchStream(params: PaginationParams = {}) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_AUTHORIZATION;

  if (!accountId || !apiToken) {
    throw new Error('Missing Cloudflare credentials');
  }

  const searchParams = new URLSearchParams();

  if (params.after) searchParams.append('after', params.after);
  if (params.before) searchParams.append('before', params.before);
  if (params.asc !== undefined)
    searchParams.append('asc', params.asc.toString());
  if (params.creator) searchParams.append('creator', params.creator);
  if (params.end) searchParams.append('end', params.end);
  if (params.include_counts) searchParams.append('include_counts', 'true');
  if (params.search) searchParams.append('search', params.search);
  if (params.start) searchParams.append('start', params.start);
  if (params.status) searchParams.append('status', params.status);
  if (params.type) searchParams.append('type', params.type);
  if (params.video_name) searchParams.append('video_name', params.video_name);

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?${searchParams.toString()}`;

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
    console.log(data);

    // Extract the last video's created date as cursor for next page
    const lastVideo = data.result[data.result.length - 1];
    const nextCursor = lastVideo?.created;

    return {
      videos: data.result,
      nextCursor, // Use the last video's created date as cursor
      hasMore: data.range ? data.range > 0 : data.result.length > 0,
      total: data.result.length,
      range: data.range,
      success: data.success,
      errors: data.errors,
    };
  } catch (error) {
    console.error('Error fetching Stream videos:', error);
    throw error;
  }
}
