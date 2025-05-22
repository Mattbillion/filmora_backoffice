import { z } from 'zod';

import type { BaseType, ID, PrettyType } from '@/lib/fetch/types';

export const variantsSchema = z.object({
  merch_id: z.number(),
  sku: z.string(),
  is_master: z.boolean().default(false),
  body: z.string().optional().default(''),
  price: z.number().optional(),
  stock: z.number().optional().default(0),
  status: z.boolean().default(true),
  com_id: z.number(),
  cat_id: z.number(),
});

export type VariantBodyType = z.infer<typeof variantsSchema>;

export type VariantItemType = PrettyType<
  BaseType<VariantBodyType> & {
    com_id: ID;
    cat_id: ID;
  }
>;

export const RVK_VARIANTS = 'variants';
