import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const variantOptionValueSchema = z.object({
  com_id: z.number(),
  option_type_id: z.number(),
  value: z.string(),
  merch_id: z.number(),
});

export type VariantOptionValueBodyType = z.infer<
  typeof variantOptionValueSchema
>;

export type VariantOptionValueItemType = PrettyType<
  BaseType<VariantOptionValueBodyType>
>;

export const RVK_VARIANT_OPTION_VALUE = 'variant_option_value';

export interface OptionValueInterface {
  id: number;
  com_id: number;
  cat_id: number;
  option_type_id: number;
  value: string;
  display_order: number;
  status: boolean;
  option_name: string;
}
