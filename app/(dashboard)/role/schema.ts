import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const roleSchema = z.object({
  role_name: z.string(),
  role_order: z.number().optional(),
  status: z.boolean(),
});

export type RoleBodyType = z.infer<typeof roleSchema>;

export type RoleItemType = PrettyType<BaseType<RoleBodyType>>;

export const RVK_ROLE = 'role';
