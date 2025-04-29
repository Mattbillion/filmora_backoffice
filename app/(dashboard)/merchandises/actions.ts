import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  MerchandisesBodyType,
  MerchandisesItemType,
  RVK_MERCHANDISES,
} from './schema';

export const createMerchandises = async (bodyData: MerchandisesBodyType) => {
  const { body, error } = await xooxFetch<{ data: MerchandisesItemType }>(
    'merchandises',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISES]);
  return { data: body, error: null };
};

export const patchMerchandises = async ({
  id,
  ...bodyData
}: MerchandisesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: MerchandisesItemType }>(
    `/merchandises/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISES, `${RVK_MERCHANDISES}_${id}`]);
  return { data: body, error: null };
};

export const deleteMerchandises = async (id: ID) => {
  const { body, error } = await xooxFetch(`/merchandises/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISES, `${RVK_MERCHANDISES}_${id}`]);
  return { data: body, error: null };
};

export const getMerchandisesList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<MerchandisesItemType[]>
    >('/merchandises', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_MERCHANDISES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getMerchandiseDetail = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: MerchandisesItemType }>(
      `/merchandises/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_MERCHANDISES}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return { data: null, error };
  }
};
