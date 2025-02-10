import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  MerchandiseBodyType,
  MerchandiseItemType,
  RVK_MERCHANDISE,
} from './schema';

export const createMerchandise = async (bodyData: MerchandiseBodyType) => {
  const { body, error } = await xooxFetch<{ data: MerchandiseItemType }>(
    'merchandises',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISE]);
  return { data: body, error: null };
};

export const patchMerchandise = async ({
  id,
  ...bodyData
}: MerchandiseBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: MerchandiseItemType }>(
    `/merchandises/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISE, `${RVK_MERCHANDISE}_${id}`]);
  return { data: body, error: null };
};

export const deleteMerchandise = async (id: ID) => {
  const { body, error } = await xooxFetch(`/merchandises/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_MERCHANDISE, `${RVK_MERCHANDISE}_${id}`]);
  return { data: body, error: null };
};

export const getMerchandiseList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<MerchandiseItemType[]>
    >('/merchandises', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_MERCHANDISE] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getMerchandise = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: MerchandiseItemType }>(
      `/merchandises/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_MERCHANDISE}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return { data: null, error };
  }
};
