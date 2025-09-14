import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/filmora';

import { HallsBodyType, HallsItemType, RVK_HALLS } from './schema';

export const getHallDetail = async (hallId: ID | string) => {
  try {
    const { body, error } = await filmoraFetch<{ data: HallsItemType }>(
      `/halls/${hallId}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_HALLS}_${hallId}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching hallDetail:`, error);
    return { data: null, error };
  }
};

export const getHalls = async (
  searchParams: QueryParams = {},
  cacheKeys: string[] = [],
) => {
  try {
    const { body, error } = await filmoraFetch<PaginatedResType<HallsItemType[]>>(
      '/halls',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_HALLS, ...cacheKeys] },
      },
    );

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /halls:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getHallsHash = async (searchParams?: QueryParams) => {
  try {
    const { data } = await getHalls(searchParams, [
      `${RVK_HALLS}_${Buffer.from(JSON.stringify(searchParams || {})).toString('base64')}`,
    ]);

    return {
      data: (data.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur.hall_name }),
        {},
      ) as Record<ID, string>,
    };
  } catch (error) {
    console.error(`Error fetching getCategoriesHash`, error);
    return { data: {} as Record<ID, string>, error };
  }
};

export const createHalls = async (bodyData: HallsBodyType) => {
  const { body, error } = await filmoraFetch(`/halls`, {
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
  const { body, error } = await filmoraFetch<{ data: HallsItemType }>(
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
  const { body, error } = await filmoraFetch(`/halls/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_HALLS, `${RVK_HALLS}_${param1}`]);
  return { data: body, error: null };
};
