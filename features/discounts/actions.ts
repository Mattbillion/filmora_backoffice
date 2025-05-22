import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { DiscountsBodyType, DiscountsItemType, RVK_DISCOUNTS } from './schema';

export const getDiscounts = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<DiscountsItemType[]>
    >('/discounts', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_DISCOUNTS] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.log(`Error fetching /discounts:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getDiscountsHash = async (searchParams: QueryParams = {}) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<DiscountsItemType[]>
    >('/discounts', {
      method: 'GET',
      searchParams: { ...searchParams, page_size: 100000000 },
      next: { tags: [RVK_DISCOUNTS] },
    });

    if (error) throw new Error(error);

    return {
      data: (body.data || []).reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: `${cur.discount_name}: ${cur.discount_desc}`,
        }),
        {},
      ) as Record<ID, string>,
    };
  } catch (error) {
    console.error('Error fetching getDiscountsHash:', error);
    return { data: {} as Record<ID, string>, error };
  }
};

export const getDiscountsDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: DiscountsItemType }>(
      `/discounts/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_DISCOUNTS}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /discounts/${param1}:`, error);
    return { data: null, error };
  }
};

export const createDiscounts = async (bodyData: DiscountsBodyType) => {
  const { body, error } = await xooxFetch(`/discounts`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_DISCOUNTS]);
  return { data: body, error: null };
};

export const patchDiscountsDetail = async ({
  id: param1,
  ...bodyData
}: DiscountsBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: DiscountsItemType }>(
    `/discounts/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_DISCOUNTS, `${RVK_DISCOUNTS}_${param1}`]);
  return { data: body, error: null };
};

export const deleteDiscountsDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/discounts/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_DISCOUNTS, `${RVK_DISCOUNTS}_${param1}`]);
  return { data: body, error: null };
};
