import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const ordersSchema = z.object({
  order_id: z.number(),
  order_number: z.string(),
  order_status: z.string(),
  payment_deadline: z.string(),
  order_date: z.string(),
  order_time: z.string(),
  product_count: z.number(),
});

export type OrdersBodyType = z.infer<typeof ordersSchema>;

export type OrdersItemType = PrettyType<BaseType<OrdersBodyType>>;

export const RVK_ORDERS = 'orders';
