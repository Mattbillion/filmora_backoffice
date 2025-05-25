import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { RVK_VARIANTS, VariantItemType, VariantsBodyType } from './schema';

export const generateVariants = async (searchParams: QueryParams) => {
  const { body, error } = await xooxFetch<{ data: VariantItemType[] }>(
    'generate_variants',
    {
      method: 'POST',
      searchParams,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VARIANTS]);
  return { data: body, error: null };
};

export const getVariantList = async (
  merchId: string,
  searchParams?: QueryParams,
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<VariantItemType[]>
    >('/merchandise_attribute_values', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_VARIANTS, `${RVK_VARIANTS}_${merchId}`] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching merchandise_attribute_values:', error);
    return { data: { data: [] as VariantItemType[], total_count: 0 }, error };
  }
};

export const patchVariants = async (bodyData: VariantsBodyType) => {
  const { body, error } = await xooxFetch<{ data: VariantItemType[] }>(
    `/update_variants`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VARIANTS]);
  return { data: body, error: null };
};

export const deleteVariant = async (id: ID, searchParams?: QueryParams) => {
  const { body, error } = await xooxFetch(
    `/merchandise_attribute_values/${id}`,
    {
      method: 'DELETE',
      searchParams,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_VARIANTS, `${RVK_VARIANTS}_${id}`]);
  return { data: body, error: null };
};
