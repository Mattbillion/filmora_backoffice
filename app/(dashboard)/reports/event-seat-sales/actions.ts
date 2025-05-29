import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';

import { EventSeatSalesItemType, RVK_EVENT_SEAT_SALES } from './schema';

export const getEventSeatSalesDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: EventSeatSalesItemType }>(
      `/event-seat-sales/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_EVENT_SEAT_SALES}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /event-seat-sales/${param1}:`, error);
    return { data: null, error };
  }
};
