import { xooxFetch } from '@/lib/fetch';
import { QueryParams } from '@/lib/utils';

import { EventSeatSalesItemType, RVK_EVENT_SEAT_SALES } from './schema';

export const getEventSeatSalesDetail = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<{ data: EventSeatSalesItemType[] }>(
      '/event-seat-sales',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_EVENT_SEAT_SALES] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /event-seat-sales:`, error);
    return { data: null, error };
  }
};
