import { z } from 'zod';

import { BaseType, PrettyType } from '@/lib/fetch/types';

export const hallSchema = z.object({
  hall_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  hall_desc: z.string().min(2, {
    message: 'Body must be at least 2 characters.',
  }),
  hall_logo: z.string().optional(),
  status: z.boolean(),
});

export type HallBodyType = z.infer<typeof hallSchema>;

export type HallItemType = PrettyType<BaseType<HallBodyType>>;

export const RVK_HALL = 'hall';
