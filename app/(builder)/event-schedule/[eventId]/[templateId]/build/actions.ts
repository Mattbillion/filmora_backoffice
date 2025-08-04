import { RVK_SCHEDULES } from '@/app/(dashboard)/events/[id]/schedules/schema';
import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';
import { executeRevalidate } from '@/lib/xoox';

export async function createSchedule(eventId: string | ID, formData: FormData) {
  try {
    const { body, error } = await xooxFetch<{
      data: {
        seats: { seat_no: string; id: number }[];
        schedule: {
          create_event_schedules: ID;
        };
      };
    }>(`/events/${eventId}/create-schedule`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
      syncTable: 'events',
    });

    if (error) throw new Error(error);

    executeRevalidate([RVK_SCHEDULES]);
    return { data: body };
  } catch (error) {
    console.error(`Error create schedule`, error);
    return { data: { data: null }, error };
  }
}

export async function uploadScheduleTicketJson(
  scheduleId: string | ID,
  formData: FormData,
) {
  try {
    const { body, error } = await xooxFetch(
      `/events/${scheduleId}/upload-tickets-json`,
      { method: 'POST', body: formData, cache: 'no-store' },
    );

    if (error) throw new Error(error);

    executeRevalidate([RVK_SCHEDULES]);
    return { data: body };
  } catch (error) {
    console.error(`Error upload schedule tickets.json`, error);
    return { data: { data: null }, error };
  }
}
