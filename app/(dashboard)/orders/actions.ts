import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { OrderBodyType, OrderItemType, RVK_ORDER } from './schema';

export const createOrder = async (bodyData: OrderBodyType) => {
  const { body, error } = await xooxFetch<{ data: OrderItemType }>('orders', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ORDER]);
  return { data: body, error: null };
};

export const patchOrder = async ({
  id,
  ...bodyData
}: OrderBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: OrderItemType }>(
    `/orders/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ORDER, `${RVK_ORDER}_${id}`]);
  return { data: body, error: null };
};

export const deleteOrder = async (id: ID) => {
  const { body, error } = await xooxFetch(`/orders/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ORDER, `${RVK_ORDER}_${id}`]);
  return { data: body, error: null };
};

export const getOrderList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<OrderItemType[]>>(
      '/orders',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_ORDER] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getOrder = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: OrderItemType }>(
      `/orders/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_ORDER}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: null, error };
  }
};
