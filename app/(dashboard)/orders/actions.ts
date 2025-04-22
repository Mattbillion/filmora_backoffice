import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';

import { OrdersItemType, RVK_ORDERS } from './schema';

export const getOrders = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<OrdersItemType[]>>(
      '/orders',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_ORDERS] },
      },
    );

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /orders:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getOrdersDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: OrdersItemType }>(
      `/orders/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_ORDERS}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /orders/${param1}:`, error);
    return { data: null, error };
  }
};
