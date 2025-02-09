import { z } from 'zod';

import { BaseType, PrettyType } from '@/lib/fetch/types';

export const branchSchema = z.object({
  branch_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  branch_desc: z.string().min(2, {
    message: 'Body must be at least 2 characters.',
  }),
  branch_logo: z.string().optional(),
  status: z.boolean(),
});

export type BranchBodyType = z.infer<typeof branchSchema>;

export type BranchItemType = PrettyType<BaseType<BranchBodyType>>;

export const RVK_BRANCH = 'branch';
