import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const scheduleSchema = z.object({
  date: z.string(),
  status: z.boolean(),
  start_at: z.string(),
  end_at: z.string(),
  template_id: z.number(),
  price: z.number(),
});

export const bosooScheduleSchema = z.object({
  date: z.string(),
  status: z.boolean(),
  start_at: z.string(),
  end_at: z.string(),
  hall_id: z.number(),
  company_id: z.number(),
  price: z.number(),
});

export type SchedulesBodyType = z.infer<typeof scheduleSchema>;

export type BosooSchedulesBodyType = z.infer<typeof bosooScheduleSchema>;

export type SchedulesItemType = PrettyType<
  BaseType<
    SchedulesBodyType & {
      hall_id: number;
      company_id: number;
      venue_id: number;
      branch_id: number;
      event_id: number;
      seat_json_url: string;
      ticket_json_url?: string;
    }
  >
>;

export const RVK_SCHEDULES = 'schedules';
