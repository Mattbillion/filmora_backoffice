import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  RVK_VARIANT_OPTION_VALUE,
  VariantOptionValueBodyType,
  VariantOptionValueItemType,
} from './schema';

export const createVariantOptionValue = async (
  bodyData: VariantOptionValueBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: VariantOptionValueItemType }>(
    'merchandise_attribute_option_values',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VARIANT_OPTION_VALUE]);
  return { data: body, error: null };
};

export const patchVariantOptionValue = async ({
  id,
  ...bodyData
}: VariantOptionValueBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: VariantOptionValueItemType }>(
    `/merchandise_attribute_option_values/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_VARIANT_OPTION_VALUE,
    `${RVK_VARIANT_OPTION_VALUE}_${id}`,
  ]);
  return { data: body, error: null };
};

export const deleteVariantOptionValue = async (id: ID) => {
  const { body, error } = await xooxFetch(
    `/merchandise_attribute_option_values/${id}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_VARIANT_OPTION_VALUE,
    `${RVK_VARIANT_OPTION_VALUE}_${id}`,
  ]);
  return { data: body, error: null };
};

export const getVariantOptionValueList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<VariantOptionValueItemType[]>
    >('/merchandise_attribute_option_values', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_VARIANT_OPTION_VALUE] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching merchandise_attribute_option_values:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
