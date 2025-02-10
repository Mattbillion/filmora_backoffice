import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const merchandiseAttributeValuesSchema = z.object({
  com_id: z.number(),
  cat_id: z.number(),
  item_id: z.null(),
  attr_id: z.null(),
  value: z.null(),
  status: z.boolean(),
  created_employee: z.string(),
});

export type MerchandiseAttributeValuesBodyType = z.infer<
  typeof merchandiseAttributeValuesSchema
>;

export type MerchandiseAttributeValuesItemType = PrettyType<
  BaseType<MerchandiseAttributeValuesBodyType>
>;

export const RVK_MERCHANDISE_ATTRIBUTE_VALUES = 'merchandise-attribute-values';
