import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const hallSchema = z.object({
  venue_id: z.number(),
  branch_id: z.number(),
  hall_name: z.string(),
  hall_desc: z.string(),
  capacity: z.number(),
  hall_image: z.string(),
  hall_location: z.string(),
  hall_order: z.number(),
  hall_type: z.string(),
  amenities: z.string(),
  status: z.boolean(),
});

export type HallBodyType = z.infer<typeof hallSchema>;

export type HallItemType = PrettyType<BaseType<HallBodyType>>;

export const RVK_HALL = 'hall';
