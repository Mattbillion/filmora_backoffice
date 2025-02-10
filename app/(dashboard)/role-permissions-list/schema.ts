import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const rolePermissionsListSchema = z.object({
  role_id: z.number(),
  permission_id: z.number(),
  status: z.boolean(),
  created_employee: z.string(),
});

export type RolePermissionsListBodyType = z.infer<
  typeof rolePermissionsListSchema
>;

export type RolePermissionsListItemType = PrettyType<
  BaseType<RolePermissionsListBodyType>
>;

export const RVK_ROLE_PERMISSIONS_LIST = 'role-permissions-list';
