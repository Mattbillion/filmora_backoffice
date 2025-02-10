import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const merchandiseSchema = z.object({
  id: z.number(),
  com_id: z.number(),
  cat_id: z.number(),
  mer_name: z.string(),
  mer_desc: z.string(),
  price: z.number(),
  discount_id: z.number(),
  medias: z.array(
    z.object({
      media_url: z.string(),
      media_desc: z.string(),
      media_type: z.string(),
      media_label: z.string(),
    }),
  ),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type MerchandiseBodyType = z.infer<typeof merchandiseSchema>;

export type MerchandiseItemType = PrettyType<BaseType<MerchandiseBodyType>>;

export const RVK_MERCHANDISE = 'merchandise';
