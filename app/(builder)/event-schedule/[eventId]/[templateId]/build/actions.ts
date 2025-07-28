import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';

export async function createSchedule(eventId: string | ID, formData: FormData) {
  try {
    const { body, error } = await xooxFetch(
      `/events/${eventId}/create-schedule`,
      { method: 'POST', body: formData, cache: 'no-store' },
    );

    if (error) throw new Error(error);

    console.log(JSON.stringify(body, null, 2));
    return { data: body };
  } catch (error) {
    console.error(`Error create schedule`, error);
    return { data: { data: null }, error };
  }
}
