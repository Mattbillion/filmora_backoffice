import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const discountsSchema = z.object({
  company_id: z.number(),
  discount_name: z.string(),
  discount_desc: z.string(),
  discount_type: z.string(),
  discount: z.number(),
  start_at: z.string(),
  end_at: z.string(),
  status: z.boolean(),
});

export type DiscountsBodyType = z.infer<typeof discountsSchema>;

export type DiscountsItemType = PrettyType<BaseType<DiscountsBodyType>>;

export const RVK_DISCOUNTS = 'discounts';
