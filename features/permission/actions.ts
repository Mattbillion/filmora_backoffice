import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  PermissionByRoleItemType,
  PermissionItemType,
  RoleByPermissionBodyType,
  RVK_PERMISSION,
} from './schema';

export const createRoleByPermission = async (
  bodyData: RoleByPermissionBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: PermissionByRoleItemType }>(
    'role_permissions',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([`${RVK_PERMISSION}_${bodyData.role_id}`]);
  return { data: body, error: null };
};

export const deleteRoleByPermission = async (id: ID) => {
  const { body, error } = await xooxFetch(`/role_permissions/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_PERMISSION, `${RVK_PERMISSION}_${id}`]);
  return { data: body, error: null };
};

export const getPermissionList = async (
  searchParams?: QueryParams,
  headers?: Record<string, string>,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<PermissionItemType[]>
    >('/permissions', {
      method: 'GET',
      searchParams,
      headers,
      next: { tags: [RVK_PERMISSION] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getAssignedPermission = async (
  headers?: Record<string, string>,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<PermissionByRoleItemType[]>
    >('/permissions_list', {
      method: 'GET',
      searchParams: { page_size: 1000 },
      headers,
      next: { tags: [`ASSIGNED_${RVK_PERMISSION}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching assigned permissions:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getPermissionsByRoleId = async (
  id: ID,
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<PermissionByRoleItemType[]>
    >(`/role_permissions/${id}`, {
      method: 'GET',
      searchParams,
      next: { tags: [`${RVK_PERMISSION}_${id}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching permissions by role id:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
