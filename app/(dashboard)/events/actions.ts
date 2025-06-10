import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { EventsBodyType, EventsItemType, RVK_EVENTS } from './schema';

export const createEvents = async (bodyData: EventsBodyType) => {
  const { body, error } = await xooxFetch<{ data: EventsItemType }>('events', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
    syncTable: 'events',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_EVENTS]);
  return { data: body, error: null };
};

export const patchEvents = async ({
  id,
  ...bodyData
}: EventsBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: EventsItemType }>(
    `/events/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
      syncTable: 'events',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_EVENTS, `${RVK_EVENTS}_${id}`]);
  return { data: body, error: null };
};

export const deleteEvents = async (id: ID) => {
  const { body, error } = await xooxFetch(`/events/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
    syncTable: 'events',
  });

  if (error) throw new Error(error);
  executeRevalidate([RVK_EVENTS, `${RVK_EVENTS}_${id}`]);
  return { data: body, error: null };
};

export const getEventsList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<EventsItemType[]>>(
      '/events',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_EVENTS] },
      },
    );

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getEventsHash = async () => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<EventsItemType[]>>(
      '/events',
      {
        method: 'GET',
        searchParams: { page_size: 100000 },
        next: { tags: [`${RVK_EVENTS}_hierarchical`] },
      },
    );

    if (error) throw new Error(error);

    return {
      data: (body.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur.event_name }),
        {},
      ) as Record<ID, string>,
    };
  } catch (error) {
    console.error(`Error fetching getCategoriesHash`, error);
    return { data: {} as Record<ID, string>, error };
  }
};

export const getEventDetail = async (id: ID | string) => {
  try {
    const { body, error } = await xooxFetch<{ data: EventsItemType }>(
      `/events/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_EVENTS}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: null, error };
  }
};
