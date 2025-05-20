import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { RVK_VENUES, VenuesBodyType, VenuesItemType } from './schema';

export const getVenues = async (searchParams?: QueryParams) => {
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

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /venues:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getVenuesDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: VenuesItemType }>(
      `/venues/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_VENUES}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /venues/${param1}:`, error);
    return { data: null, error };
  }
};

export const createVenues = async (bodyData: VenuesBodyType) => {
  const { body, error } = await xooxFetch(`/venues`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUES]);
  return { data: body, error: null };
};

export const patchVenuesDetail = async ({
  id: param1,
  ...bodyData
}: VenuesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: VenuesItemType }>(
    `/venues/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUES, `${RVK_VENUES}_${param1}`]);
  return { data: body, error: null };
};

export const deleteVenuesDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/venues/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_VENUES, `${RVK_VENUES}_${param1}`]);
  return { data: body, error: null };
};
