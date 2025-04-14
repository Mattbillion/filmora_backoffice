import { BranchItemType, RVK_BRANCH } from '@/app/(dashboard)/branches/schema';
import { RVK_VENUES, VenuesItemType } from '@/app/(dashboard)/venues/schema';
import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { HallsBodyType, HallsItemType, RVK_HALLS } from './schema';

export const createHalls = async (bodyData: HallsBodyType) => {
  const { body, error } = await xooxFetch<{ data: HallsItemType }>('halls', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS]);
  return { data: body, error: null };
};

export const patchHalls = async ({
  id,
  ...bodyData
}: HallsBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: HallsItemType }>(
    `/halls/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS, `${RVK_HALLS}_${id}`]);
  return { data: body, error: null };
};

export const deleteHalls = async (id: ID) => {
  const { body, error } = await xooxFetch(`/halls/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS, `${RVK_HALLS}_${id}`]);
  return { data: body, error: null };
};

export const getHallsList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<HallsItemType[]>>(
      '/halls',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_HALLS] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching halls:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getHalls = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: HallsItemType }>(
      `/halls/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_HALLS}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching halls:', error);
    return { data: null, error };
  }
};

export const fetchBranches = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<BranchItemType[]>>(
      '/branches',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_BRANCH] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching branches:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const fetchVenues = async (searchParams?: QueryParams) => {
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
    console.error('Error fetching Venues:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
