import { z } from 'zod';

import { BaseType, PrettyType } from '@/lib/fetch/types';

export const tagSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  status: z.enum(['0', '1', '2']),
  banner: z.string(),
  description: z.string(),
});

export type TagBodyType = z.infer<typeof tagSchema>;

export type TagItemType = PrettyType<BaseType<TagBodyType>>;

export const RVK_TAG = 'tags';
