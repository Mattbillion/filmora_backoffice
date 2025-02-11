import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const orderSchema = z.object({
  order_number: z.string(),
  total_price: z.number(),
  order_status: z.string(),
  payment_method: z.null(),
  payment_deadline: z.string(),
  purchase_at: z.date(),
  order_date: z.string(),
  order_time: z.string(),
  user_id: z.string(),
});

export type OrderBodyType = z.infer<typeof orderSchema>;

export type OrderItemType = PrettyType<BaseType<OrderBodyType>>;

export const RVK_ORDER = 'order';
