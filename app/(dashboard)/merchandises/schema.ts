import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const merchandisesSchema = z.object({
  com_id: z.number(),
  cat_id: z.number(),
  mer_name: z.string(),
  mer_desc: z.string(),
  price: z.number(),
  discount_id: z.number().optional(),
  medias: z.array(
    z.object({
      media_url: z.string(),
      media_desc: z.string(),
      media_type: z.string(),
      media_label: z.string(),
    }),
  ),
  status: z.boolean(),
});

export type MerchandisesBodyType = z.infer<typeof merchandisesSchema>;

export type MerchandisesItemType = PrettyType<BaseType<MerchandisesBodyType>>;

export const RVK_MERCHANDISES = 'merchandises';
