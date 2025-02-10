import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const discountSchema = z.object({
  id: z.number(),
  com_id: z.number(),
  discount_name: z.string(),
  discount_desc: z.string(),
  discount_type: z.string(),
  discount: z.number(),
  start_at: z.string(),
  end_at: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type DiscountBodyType = z.infer<typeof discountSchema>;

export type DiscountItemType = PrettyType<BaseType<DiscountBodyType>>;

export const RVK_DISCOUNT = 'discount';
