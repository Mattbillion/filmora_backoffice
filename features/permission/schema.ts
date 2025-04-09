import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const permissionSchema = z.object({
  permission_name: z.string(),
  status: z.boolean(),
  created_at: z.string(),
});

export const roleByPermissionSchema = z.object({
  permission_id: z.string(),
  role_id: z.string(),
  status: z.boolean(),
});

export type PermissionBodyType = z.infer<typeof permissionSchema>;

export type RoleByPermissionBodyType = z.infer<typeof roleByPermissionSchema>;

export type PermissionItemType = PrettyType<BaseType<PermissionBodyType>>;

export type PermissionByRoleItemType = PrettyType<
  BaseType<RoleByPermissionBodyType>
>;

export const RVK_PERMISSION = 'permission';
