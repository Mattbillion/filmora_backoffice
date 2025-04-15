import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const bannersSchema = z.object({
  title: z.string(),
  picture: z.string(),
  link: z.string(),
  location: z.string(),
  special_cat_id: z.null(),
  status: z.boolean(),
});

export type BannersBodyType = z.infer<typeof bannersSchema>;

export type BannersItemType = PrettyType<BaseType<BannersBodyType>>;

export const RVK_BANNERS = 'banners';
