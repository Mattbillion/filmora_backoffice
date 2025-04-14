import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { VenuesBodyType, VenuesItemType, RVK_VENUES } from './schema';

export const createVenues = async (bodyData: VenuesBodyType) => {
  const { body, error } = await xooxFetch<{ data: VenuesItemType }>('venues', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUES]);
  return { data: body, error: null };
};

export const patchVenues = async ({
  id,
  ...bodyData
}: VenuesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: VenuesItemType }>(
    `/venues/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUES, `${RVK_VENUES}_${id}`]);
  return { data: body, error: null };
};

export const deleteVenues = async (id: ID) => {
  const { body, error } = await xooxFetch(`/venues/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUES, `${RVK_VENUES}_${id}`]);
  return { data: body, error: null };
};

export const getVenuesList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<VenuesItemType[]>>(
      '/venues',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_VENUES] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching venues:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getVenues = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: VenuesItemType }>(
      `/venues/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_VENUES}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching venues:', error);
    return { data: null, error };
  }
};
