import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { DiscountBodyType, DiscountItemType, RVK_DISCOUNT } from './schema';

export const createDiscount = async (bodyData: DiscountBodyType) => {
  const { body, error } = await xooxFetch<{ data: DiscountItemType }>(
    'discounts',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_DISCOUNT]);
  return { data: body, error: null };
};

export const patchDiscount = async ({
  id,
  ...bodyData
}: DiscountBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: DiscountItemType }>(
    `/discounts/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_DISCOUNT, `${RVK_DISCOUNT}_${id}`]);
  return { data: body, error: null };
};

export const deleteDiscount = async (id: ID) => {
  const { body, error } = await xooxFetch(`/discounts/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_DISCOUNT, `${RVK_DISCOUNT}_${id}`]);
  return { data: body, error: null };
};

export const getDiscountList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<DiscountItemType[]>
    >('/discounts', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_DISCOUNT] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getDiscount = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: DiscountItemType }>(
      `/discounts/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_DISCOUNT}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return { data: null, error };
  }
};
