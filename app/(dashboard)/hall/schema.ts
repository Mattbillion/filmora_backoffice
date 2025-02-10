import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const hallSchema = z.object({
  id: z.number(),
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
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type HallBodyType = z.infer<typeof hallSchema>;

export type HallItemType = PrettyType<BaseType<HallBodyType>>;

export const RVK_HALL = 'hall';
