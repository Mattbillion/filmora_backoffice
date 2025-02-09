import { z } from 'zod';

import { BaseType, PrettyType } from '@/lib/fetch/types';

export const bannerSchema = z.object({
  banner_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  banner_desc: z.string().min(2, {
    message: 'Body must be at least 2 characters.',
  }),
  banner_logo: z.string().optional(),
  status: z.boolean(),
});

export type BannerBodyType = z.infer<typeof bannerSchema>;

export type BannerItemType = PrettyType<BaseType<BannerBodyType>>;

export const RVK_BANNER = 'banner';
