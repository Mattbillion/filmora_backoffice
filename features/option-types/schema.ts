import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const optionTypesSchema = z.object({
  option_name: z.string(),
  option_name_mn: z.string(),
  option_desc: z.string(),
  option_type: z.string(),
  display_order: z.number(),
  status: z.boolean(),
});

export type OptionTypesBodyType = {
  id: number;
  option_name: string;
  option_name_mn: string;
  option_desc?: string;
  option_type: string;
  display_order: number;
  status: boolean;
  created_at: string;
  updated_at?: string;
  created_employee: string;
};

export type OptionTypesItemType = PrettyType<BaseType<OptionTypesBodyType>>;

export const RVK_OPTIONTYPES = 'optionTypes';
