import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const roleSchema = z.object({
  id: z.number(),
  role_name: z.string(),
  role_order: z.number(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type RoleBodyType = z.infer<typeof roleSchema>;

export type RoleItemType = PrettyType<BaseType<RoleBodyType>>;

export const RVK_ROLE = 'role';
