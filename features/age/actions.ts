import { filmoraFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/filmora';

import {
  AgeRestrictionsBodyType,
  AgeRestrictionsItemType,
  RVK_AGE_RESTRICTIONS,
} from './schema';

export const getAgeRestrictions = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<AgeRestrictionsItemType[]>
    >('/age_restrictions', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_AGE_RESTRICTIONS] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /age_restrictions:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getAgeRestrictionsHash = async () => {
  try {
    const { body, error } = await filmoraFetch<
      PaginatedResType<AgeRestrictionsItemType[]>
    >('/age_restrictions', {
      method: 'GET',
      searchParams: { page_size: 100000 },
      next: { tags: [`${RVK_AGE_RESTRICTIONS}_hierarchical`] },
    });

    if (error) throw new Error(error);

    return {
      data: (body.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur.age_name }),
        {},
      ) as Record<ID, string>,
    };
  } catch (error) {
    console.error(`Error fetching getCategoriesHash`, error);
    return { data: {} as Record<ID, string>, error };
  }
};

export const getAgeRestrictionsDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await filmoraFetch<{ data: AgeRestrictionsItemType }>(
      `/age_restrictions/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_AGE_RESTRICTIONS}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /age_restrictions/${param1}:`, error);
    return { data: null, error };
  }
};

export const createAgeRestrictions = async (
  bodyData: AgeRestrictionsBodyType,
) => {
  const { body, error } = await filmoraFetch(`/age_restrictions`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_AGE_RESTRICTIONS]);
  return { data: body, error: null };
};

export const patchAgeRestrictionsDetail = async ({
  id: param1,
  ...bodyData
}: AgeRestrictionsBodyType & { id: ID }) => {
  const { body, error } = await filmoraFetch<{ data: AgeRestrictionsItemType }>(
    `/age_restrictions/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_AGE_RESTRICTIONS,
    `${RVK_AGE_RESTRICTIONS}_${param1}`,
  ]);
  return { data: body, error: null };
};

export const deleteAgeRestrictionsDetail = async (param1: string | ID) => {
  const { body, error } = await filmoraFetch(`/age_restrictions/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_AGE_RESTRICTIONS,
    `${RVK_AGE_RESTRICTIONS}_${param1}`,
  ]);
  return { data: body, error: null };
};
