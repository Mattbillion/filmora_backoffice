import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const attributeValuesSchema = z.object({
  id: z.number(),
  com_id: z.number(),
  cat_id: z.number(),
  attr_id: z.number(),
  value: z.string(),
  display_order: z.number(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type AttributeValuesBodyType = z.infer<typeof attributeValuesSchema>;

export type AttributeValuesItemType = PrettyType<
  BaseType<AttributeValuesBodyType>
>;

export const RVK_ATTRIBUTE_VALUES = 'attribute-values';
