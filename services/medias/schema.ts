import { z } from 'zod';

import type { BaseType, PrettyType } from '../api/types';

export const mediaSchema = z.object({
  file_name: z.string(),
  file_size: z.number(),
  image_url: z.string(),
  content_type: z.string(),
});

export type MediaBodyType = z.infer<typeof mediaSchema>;

export type MediaItemType = PrettyType<BaseType<MediaBodyType>>;

export const RVK_MEDIA = 'media';
