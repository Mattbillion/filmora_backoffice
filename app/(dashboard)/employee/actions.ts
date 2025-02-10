import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { EmployeeBodyType, EmployeeItemType, RVK_EMPLOYEE } from './schema';

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
      method: 'PATCH',
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

export const getEmployee = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: EmployeeItemType }>(
      `/employees/${id}`,
      {
        method: 'GET',
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
