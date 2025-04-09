import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const permissionSchema = z.object({
  permission_name: z.string(),
  status: z.boolean(),
  created_at: z.string(),
});

export type PermissionBodyType = z.infer<typeof permissionSchema>;

export type PermissionItemType = PrettyType<BaseType<PermissionBodyType>>;

export const RVK_PERMISSION = 'permission';
