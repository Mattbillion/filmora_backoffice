import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

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
