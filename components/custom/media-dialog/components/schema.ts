import { z } from 'zod';

import type { PrettyType } from '@/lib/fetch/types';

export const mediaSchema = z.object({
  id: z.string(),
  image_url: z.string(),
  file_name: z.string(),
  file_size: z.number(),
  content_type: z.string(),
  created_at: z.string(),
});

export type MediaBodyType = z.infer<typeof mediaSchema>;

export type MediaItemType = PrettyType<MediaBodyType>;

export const RVK_MEDIA = 'media';
