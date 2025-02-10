import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { VenueBodyType, VenueItemType, RVK_VENUE } from './schema';

export const createVenue = async (bodyData: VenueBodyType) => {
  const { body, error } = await xooxFetch<{ data: VenueItemType }>('venues', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUE]);
  return { data: body, error: null };
};

export const patchVenue = async ({
  id,
  ...bodyData
}: VenueBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: VenueItemType }>(
    `/venues/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUE, `${RVK_VENUE}_${id}`]);
  return { data: body, error: null };
};

export const deleteVenue = async (id: ID) => {
  const { body, error } = await xooxFetch(`/venues/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUE, `${RVK_VENUE}_${id}`]);
  return { data: body, error: null };
};

export const getVenueList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<VenueItemType[]>>(
      '/venues',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_VENUE] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching venues:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getVenue = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: VenueItemType }>(
      `/venues/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_VENUE}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching venues:', error);
    return { data: null, error };
  }
};
