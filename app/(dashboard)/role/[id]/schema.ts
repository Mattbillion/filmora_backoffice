import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const rolePermissionSchema = z.object({
  role_id: z.string(),
  permission_id: z.number().optional(),
  status: z.boolean(),
});

export type RolePermissionBodyType = z.infer<typeof rolePermissionSchema>;

export type RolePermissionItemType = PrettyType<
  BaseType<RolePermissionBodyType>
>;

export const RVK_ROLE_PERMISSION = 'role_permission';
