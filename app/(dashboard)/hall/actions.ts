import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { HallBodyType, HallItemType, RVK_HALL } from './schema';

export const createHall = async (bodyData: HallBodyType) => {
  const { body, error } = await xooxFetch<{ data: HallItemType }>('halls', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALL]);
  return { data: body, error: null };
};

export const patchHall = async ({
  id,
  ...bodyData
}: HallBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: HallItemType }>(
    `/halls/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALL, `${RVK_HALL}_${id}`]);
  return { data: body, error: null };
};

export const deleteHall = async (id: ID) => {
  const { body, error } = await xooxFetch(`/halls/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALL, `${RVK_HALL}_${id}`]);
  return { data: body, error: null };
};

export const getHallList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<HallItemType[]>>(
      '/halls',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_HALL] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching halls:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getHall = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: HallItemType }>(
      `/halls/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_HALL}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching halls:', error);
    return { data: null, error };
  }
};
