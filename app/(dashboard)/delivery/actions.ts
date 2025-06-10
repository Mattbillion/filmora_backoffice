import { EventsItemType } from '@/app/(dashboard)/events/schema';
import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { DeliveryItem, OrdersItemType, RVK_ORDERS } from './schema';

export const getDeliveries = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<OrdersItemType[]>>(
      '/orders',
      {
        method: 'GET',
        searchParams,
        cache: 'no-store',
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

export const getDelivery = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{
      data: DeliveryItem[];
      total_count: number;
    }>(`/orders/${param1}/delivery_info`, {
      method: 'GET',
      next: {
        tags: [`${RVK_ORDERS}_delivery`],
      },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /orders/${param1}:`, error);
    return { data: null, error };
  }
};

export const markAsDelivered = async (deliveryId: ID) => {
  const { body, error } = await xooxFetch<{ data: EventsItemType }>(
    `/delivery/${deliveryId}/status`,
    {
      method: 'PUT',
      body: { new_status: 'delivered' },
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ORDERS, `${RVK_ORDERS}_delivery`]);
  return { data: body, error: null };
};
