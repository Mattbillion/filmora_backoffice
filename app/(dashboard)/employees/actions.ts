import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  EmployeeBodyType,
  EmployeeChangeEmailBody,
  EmployeeChangePasswordBody,
  EmployeeItemType,
  RVK_EMPLOYEE,
} from './schema';

export const createEmployee = async (bodyData: EmployeeBodyType) => {
  const { body, error } = await xooxFetch<{ data: EmployeeItemType }>(
    'employees',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_EMPLOYEE]);
  return { data: body, error: null };
};

export const patchEmployee = async ({
  id,
  ...bodyData
}: EmployeeBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: EmployeeItemType }>(
    `/employees/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_EMPLOYEE, `${RVK_EMPLOYEE}_${id}`]);
  return { data: body, error: null };
};

export const deleteEmployee = async (id: ID) => {
  const { body, error } = await xooxFetch(`/employees/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_EMPLOYEE, `${RVK_EMPLOYEE}_${id}`]);
  return { data: body, error: null };
};

export const getEmployeeList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<EmployeeItemType[]>
    >('/employees', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_EMPLOYEE] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getEmployee = async ({
  id,
  searchParams,
}: {
  id: string;
  searchParams?: QueryParams;
}) => {
  try {
    const { body, error } = await xooxFetch<{ data: EmployeeItemType }>(
      `/employees/${id}`,
      {
        method: 'GET',
        searchParams,
        next: { tags: [`${RVK_EMPLOYEE}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { data: null, error };
  }
};

export const changeEmployeePassword = async ({
  userId,
  ...bodyData
}: EmployeeChangePasswordBody & { userId: number }) => {
  try {
    const { body, error } = await xooxFetch<{
      data: EmployeeChangePasswordBody;
      message?: string;
    }>(`/employees/${userId}/change-password`, {
      method: 'PUT',
      body: bodyData,
      cache: 'no-cache',
    });

    if (error) throw new Error(error);

    executeRevalidate([RVK_EMPLOYEE, `${RVK_EMPLOYEE}_${userId}`]);

    return { data: body };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};

export const changeEmployeeEmail = async ({
  userId,
  ...bodyData
}: EmployeeChangeEmailBody & { userId: number }) => {
  try {
    const { body, error } = await xooxFetch<{
      data: EmployeeChangePasswordBody;
      message?: string;
    }>(`/employees/${userId}/change-email`, {
      method: 'PUT',
      body: bodyData,
      cache: 'no-cache',
    });

    if (error) throw new Error(error);

    executeRevalidate([RVK_EMPLOYEE, `${RVK_EMPLOYEE}_${userId}`]);

    return { data: body };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
};
