import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const eventSeatSalesSchema = z.object({
  event_id: z.number(),
  seat_id: z.number(),
  seat_no: z.string(),
  section_type: z.string(),
  order_date: z.string(),
  total_quantity: z.number(),
  total_revenue: z.number(),
});

export type EventSeatSalesBodyType = z.infer<typeof eventSeatSalesSchema>;

export type EventSeatSalesItemType = PrettyType<
  BaseType<EventSeatSalesBodyType>
>;

export const RVK_EVENT_SEAT_SALES = 'event-seat-sales';
