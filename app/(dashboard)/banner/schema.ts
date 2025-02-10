import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const bannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  picture: z.string(),
  link: z.string(),
  location: z.string(),
  created_employee: z.string(),
  special_cat_id: z.number().optional(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type BannerBodyType = z.infer<typeof bannerSchema>;

export type BannerItemType = PrettyType<BaseType<BannerBodyType>>;

export const RVK_BANNER = 'banner';
