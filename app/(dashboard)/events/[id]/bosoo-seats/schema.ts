import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const bosooSeatsSchema = z.object({
  seat_no: z.string(),
  seat_name: z.string(),
  price: z.number(),
  is_reserved: z.string(),
  section_type: z.string(),
  status: z.boolean(),
  seat_stock: z.number(),
  event_id: z.number(),
  company_id: z.number(),
  selled_stock: z.number(),
  discount_id: z.number().optional(),
  current_stock: z.number(),
  sell_type: z.string(),
});

export type BosooSeatsBodyType = z.infer<typeof bosooSeatsSchema>;

export type BosooSeatsItemType = PrettyType<BaseType<BosooSeatsBodyType>>;

export const RVK_BOSOO_SEATS = 'bosoo-seats';
