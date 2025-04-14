import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const attributeValueSchema = z.object({
  com_id: z.number(),
  cat_id: z.number(),
  attr_id: z.number(),
  value: z.string(),
  display_order: z.number(),
  status: z.boolean(),
});

export type AttributeValueBodyType = z.infer<typeof attributeValueSchema>;

export type AttributeValueItemType = PrettyType<
  BaseType<AttributeValueBodyType>
>;

export const RVK_ATTRIBUTE_VALUE = 'attribute-value';
