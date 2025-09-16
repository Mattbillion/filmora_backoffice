'use server';

import { QueryParams } from '@/lib/utils';

import * as actions from '../api/actions';
import { executeRevalidate } from '../api/helpers';
import { MediaBodyType, MediaItemType, RVK_MEDIA } from './schema';

export const getMedia = async (searchParams?: QueryParams) => {
  try {
    // Try the correct endpoint based on your previous working code
    const { body, error } = await actions.get<{ data: MediaItemType[] }>(
      '/images',
      {
        searchParams,
        next: { tags: [RVK_MEDIA] },
      },
    );

    if (error) {
      console.error('API Error:', error);
      throw new Error(error);
    }

    // Handle the response structure properly
    if (!body) {
      throw new Error('No response body received');
    }

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /medias:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch media',
    };
  }
};

export const uploadMedia = async (bodyData: MediaBodyType) => {
  try {
    const { body, error } = await actions.post(`/upload-image`, bodyData);

    if (error) {
      console.error('Upload Error:', error);
      throw new Error(error);
    }

    executeRevalidate([RVK_MEDIA]);
    return { data: body, error: null };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to upload media',
    };
  }
};
