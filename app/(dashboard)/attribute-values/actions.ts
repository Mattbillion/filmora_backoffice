import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  AttributeValuesBodyType,
  AttributeValuesItemType,
  RVK_ATTRIBUTE_VALUES,
} from './schema';

export const createAttributeValues = async (
  bodyData: AttributeValuesBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: AttributeValuesItemType }>(
    'attribute-values',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ATTRIBUTE_VALUES]);
  return { data: body, error: null };
};

export const patchAttributeValues = async ({
  id,
  ...bodyData
}: AttributeValuesBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: AttributeValuesItemType }>(
    `/attribute-values/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ATTRIBUTE_VALUES, `${RVK_ATTRIBUTE_VALUES}_${id}`]);
  return { data: body, error: null };
};

export const deleteAttributeValues = async (id: ID) => {
  const { body, error } = await xooxFetch(`/attribute-values/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ATTRIBUTE_VALUES, `${RVK_ATTRIBUTE_VALUES}_${id}`]);
  return { data: body, error: null };
};

export const getAttributeValuesList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<AttributeValuesItemType[]>
    >('/attribute-values', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_ATTRIBUTE_VALUES] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching attribute-values:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getAttributeValues = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: AttributeValuesItemType }>(
      `/attribute-values/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_ATTRIBUTE_VALUES}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching attribute-values:', error);
    return { data: null, error };
  }
};
