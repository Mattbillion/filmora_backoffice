import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { RVK_SCHEDULES, SchedulesBodyType, SchedulesItemType } from './schema';

export const createSchedules = async (
  eventId: string | ID,
  bodyData: SchedulesBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: SchedulesItemType }>(
    `/events/${eventId}/create-schedule`,
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
      syncTable: 'schedules',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_SCHEDULES]);
  return { data: body, error: null };
};

export const getSchedulesList = async (
  eventId: string | ID,
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<SchedulesItemType[]>
    >(`/events/${eventId}/schedules`, {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_SCHEDULES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
