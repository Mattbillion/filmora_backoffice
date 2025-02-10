import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  AgeRestrictionsBodyType,
  AgeRestrictionsItemType,
  RVK_AGE_RESTRICTIONS,
} from './schema';

export const createAgeRestrictions = async (
  bodyData: AgeRestrictionsBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: AgeRestrictionsItemType }>(
    'age-restrictions',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_AGE_RESTRICTIONS]);
  return { data: body, error: null };
};

export const patchAgeRestrictions = async ({
  id,
  ...bodyData
}: AgeRestrictionsBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: AgeRestrictionsItemType }>(
    `/age-restrictions/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_AGE_RESTRICTIONS, `${RVK_AGE_RESTRICTIONS}_${id}`]);
  return { data: body, error: null };
};

export const deleteAgeRestrictions = async (id: ID) => {
  const { body, error } = await xooxFetch(`/age-restrictions/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_AGE_RESTRICTIONS, `${RVK_AGE_RESTRICTIONS}_${id}`]);
  return { data: body, error: null };
};

export const getAgeRestrictionsList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<AgeRestrictionsItemType[]>
    >('/age-restrictions', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_AGE_RESTRICTIONS] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching age-restrictions:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getAgeRestrictions = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: AgeRestrictionsItemType }>(
      `/age-restrictions/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_AGE_RESTRICTIONS}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching age-restrictions:', error);
    return { data: null, error };
  }
};
