import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  RolePermissionsListBodyType,
  RolePermissionsListItemType,
  RVK_ROLE_PERMISSIONS_LIST,
} from './schema';

export const createRolePermissionsList = async (
  bodyData: RolePermissionsListBodyType,
) => {
  const { body, error } = await xooxFetch<{
    data: RolePermissionsListItemType;
  }>('role-permissions-list', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ROLE_PERMISSIONS_LIST]);
  return { data: body, error: null };
};

export const patchRolePermissionsList = async ({
  id,
  ...bodyData
}: RolePermissionsListBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{
    data: RolePermissionsListItemType;
  }>(`/role-permissions-list/${id}`, {
    method: 'PATCH',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_ROLE_PERMISSIONS_LIST,
    `${RVK_ROLE_PERMISSIONS_LIST}_${id}`,
  ]);
  return { data: body, error: null };
};

export const deleteRolePermissionsList = async (id: ID) => {
  const { body, error } = await xooxFetch(`/role-permissions-list/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_ROLE_PERMISSIONS_LIST,
    `${RVK_ROLE_PERMISSIONS_LIST}_${id}`,
  ]);
  return { data: body, error: null };
};

export const getRolePermissionsListList = async (
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<RolePermissionsListItemType[]>
    >('/role-permissions-list', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_ROLE_PERMISSIONS_LIST] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching role-permissions-list:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getRolePermissionsList = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{
      data: RolePermissionsListItemType;
    }>(`/role-permissions-list/${id}`, {
      method: 'GET',
      next: { tags: [`${RVK_ROLE_PERMISSIONS_LIST}_${id}`] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching role-permissions-list:', error);
    return { data: null, error };
  }
};
