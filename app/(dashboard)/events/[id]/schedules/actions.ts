import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';

import { RVK_SCHEDULES, SchedulesItemType } from './schema';

export const getSchedulesList = async (
  eventId: string | ID,
  searchParams: QueryParams = {},
  revalidateKeys: string[] = [],
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<SchedulesItemType[]>
    >(`/events/${eventId}/schedules`, {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_SCHEDULES, ...revalidateKeys] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getSchedulesHash = async (
  eventId: string | ID,
  searchParams: QueryParams = { page_size: 10000 },
) => {
  try {
    const { data } = await getSchedulesList(eventId, searchParams, [
      `${RVK_SCHEDULES}_${Buffer.from(JSON.stringify(searchParams || {})).toString('base64')}`,
    ]);

    return {
      data: (data.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur }),
        {},
      ) as Record<ID, SchedulesItemType>,
    };
  } catch (error) {
    console.error(`Error fetching getCategoriesHash`, error);
    return { data: {} as Record<ID, SchedulesItemType>, error };
  }
};
