import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { HallsBodyType, HallsItemType, RVK_HALLS } from './schema';

export const getHalls = async (searchParams?: QueryParams) => {
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

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /halls:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const createHalls = async (bodyData: HallsBodyType) => {
  const { body, error } = await xooxFetch(`/halls`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS]);
  return { data: body, error: null };
};

export const patchHallsDetail = async ({
  id: param1,
  ...bodyData
}: HallsBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: HallsItemType }>(
    `/halls/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS, `${RVK_HALLS}_${param1}`]);
  return { data: body, error: null };
};

export const deleteHallsDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/halls/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS, `${RVK_HALLS}_${param1}`]);
  return { data: body, error: null };
};
