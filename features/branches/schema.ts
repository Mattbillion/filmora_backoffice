import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const branchesSchema = z.object({
  venue_id: z.number(),
  branch_name: z.string(),
  branch_desc: z.string(),
  branch_logo: z.string(),
  branch_phone: z.string(),
  branch_location: z.string(),
  branch_long: z.string(),
  branch_lat: z.string(),
  branch_email: z.string(),
  branch_order: z.number(),
  status: z.boolean(),
  branch_schedule: z.string(),
  branch_images: z.string(),
});

export type BranchesBodyType = z.infer<typeof branchesSchema>;

export type BranchesItemType = PrettyType<BaseType<BranchesBodyType>>;

export const RVK_BRANCHES = 'branches';
