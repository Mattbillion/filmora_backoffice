import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const venuesSchema = z.object({
  venue_name: z.string(),
  venue_desc: z.string(),
  venue_logo: z.string(),
  venue_email: z.string(),
  venue_phone: z.string(),
  venue_location: z.string(),
  status: z.boolean(),
});

export type VenuesBodyType = z.infer<typeof venuesSchema>;

export type VenuesItemType = PrettyType<BaseType<VenuesBodyType>>;

export const RVK_VENUES = 'venues';
