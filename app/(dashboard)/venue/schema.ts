import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const venueSchema = z.object({
  venue_name: z.string(),
  venue_desc: z.string(),
  venue_logo: z.string(),
  venue_email: z.string(),
  venue_phone: z.string(),
  venue_location: z.string(),
  status: z.boolean(),
  created_employee: z.string(),
});

export type VenueBodyType = z.infer<typeof venueSchema>;

export type VenueItemType = PrettyType<BaseType<VenueBodyType>>;

export const RVK_VENUE = 'venue';
