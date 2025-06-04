import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  BosooSeatsBodyType,
  BosooSeatsItemType,
  RVK_BOSOO_SEATS,
} from './schema';

export const createBosooSeats = async (bodyData: BosooSeatsBodyType) => {
  const { body, error } = await xooxFetch(`/bosoo_seats`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BOSOO_SEATS]);
  return { data: body, error: null };
};

export const patchBosooSeats = async ({
  id: param1,
  ...bodyData
}: BosooSeatsBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: BosooSeatsItemType }>(
    `/bosoo_seats/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      searchParams: { company_id: bodyData.company_id },
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_BOSOO_SEATS]);
  return { data: body, error: null };
};

export const deleteBosooSeats = async (
  id: ID | string,
  company_id: string | ID,
) => {
  const { body, error } = await xooxFetch(`/bosoo_seats/${id}`, {
    method: 'DELETE',
    searchParams: { company_id },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BOSOO_SEATS]);
  return { data: body, error: null };
};

export const getBosooSeats = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<BosooSeatsItemType[]>
    >('/bosoo_seats', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_BOSOO_SEATS] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /bosoo_seats:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
