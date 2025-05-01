import { z } from 'zod';

import type { BaseType, ID, PrettyType } from '@/lib/fetch/types';

export const variantsSchema = z.object({
  merch_id: z.number(),
  value: z.string(),
  sku: z.string(),
  is_master: z.boolean(),
  price: z.number().optional(),
  stock: z.number().optional(),
  status: z.boolean(),
});

export type VariantBodyType = z.infer<typeof variantsSchema>;

export type VariantItemType = PrettyType<
  BaseType<VariantBodyType> & {
    com_id: ID;
    cat_id: ID;
  }
>;

export const RVK_VARIANTS = 'variants';

export const variantOptionValueSchema = z.object({
  m_attr_val_id: z.number(),
  attr_id: z.number(),
  attr_val_id: z.number(),
});

export type VariantOptionValueBodyType = z.infer<
  typeof variantOptionValueSchema
>;

export type VariantOptionValueItemType = PrettyType<
  BaseType<VariantOptionValueBodyType>
>;

export const RVK_VARIANT_OPTION_VALUE = 'variant_option_value';
