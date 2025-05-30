import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const bosooSeatsSchema = z.object({
  sell_type: z.string(),
  seat_name: z.string(),
  price: z.number(),
  status: z.boolean(),
  seat_stock: z.number(),
  event_id: z.number(),
  company_id: z.number(),
  discount_id: z.number().optional(),
});

export type BosooSeatsBodyType = z.infer<typeof bosooSeatsSchema>;

export type BosooSeatsItemType = PrettyType<
  BaseType<
    BosooSeatsBodyType & {
      section_type: string;
      is_reserved: string;
      current_stock: number;
      selled_stock: number;
    }
  >
>;

export const RVK_BOSOO_SEATS = 'bosoo-seats';
