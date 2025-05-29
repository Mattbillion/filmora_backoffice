import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const eventMerchandiseSalesSchema = z.object({
  event_id: z.number(),
  event_name: z.string(),
  merchandise_id: z.number(),
  mer_name: z.string(),
  variant_id: z.number(),
  sku: z.string(),
  total_quantity_sold: z.number(),
  total_sales_amount: z.number(),
  order_date: z.string(),
});

export type EventMerchandiseSalesBodyType = z.infer<
  typeof eventMerchandiseSalesSchema
>;

export type EventMerchandiseSalesItemType = PrettyType<
  BaseType<EventMerchandiseSalesBodyType>
>;

export const RVK_EVENT_MERCHANDISE_SALES = 'event-merchandise-sales';
