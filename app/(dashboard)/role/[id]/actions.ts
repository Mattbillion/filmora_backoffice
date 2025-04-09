import { xooxFetch } from '@/lib/fetch';
import { executeRevalidate } from '@/lib/xoox';

import {
  RolePermissionBodyType,
  RolePermissionItemType,
  RVK_ROLE_PERMISSION,
} from './schema';

export const createRole = async (bodyData: RolePermissionBodyType) => {
  const { body, error } = await xooxFetch<{ data: RolePermissionItemType }>(
    'role_permissions',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ROLE_PERMISSION]);
  return { data: body, error: null };
};
