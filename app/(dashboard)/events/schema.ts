import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const eventsSchema = z.object({
  category_id: z.number(),
  company_id: z.number(),
  event_name: z.string(),
  event_desc: z.string(),
  event_capacity: z.number(),
  age_id: z.number(),
  event_type: z.string(),
  event_image: z.string(),
  event_order: z.number(),
  event_genre: z.string(),
  memo: z.string(),
  duration: z.number(),
  language: z.string(),
  sponsor_name: z.string(),
  contact_info: z.string(),
  fb_link: z.string(),
  ig_link: z.string(),
  web_link: z.string(),
  status: z.boolean(),
});

export type EventsBodyType = z.infer<typeof eventsSchema>;

export type EventsItemType = PrettyType<BaseType<EventsBodyType>>;

export const RVK_EVENTS = 'events';
