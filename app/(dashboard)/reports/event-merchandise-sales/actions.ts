import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';

import {
  EventMerchandiseSalesItemType,
  RVK_EVENT_MERCHANDISE_SALES,
} from './schema';

export const getEventMerchandiseSalesDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{
      data: EventMerchandiseSalesItemType;
    }>(`/event-merchandise-sales/${param1}`, {
      method: 'GET',
      next: { tags: [`${RVK_EVENT_MERCHANDISE_SALES}_${param1}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /event-merchandise-sales/${param1}:`, error);
    return { data: null, error };
  }
};
