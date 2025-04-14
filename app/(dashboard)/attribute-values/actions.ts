import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  AttributeValueBodyType,
  AttributeValueItemType,
  RVK_ATTRIBUTE_VALUE,
} from './schema';

export const createAttributeValue = async (
  bodyData: AttributeValueBodyType,
) => {
  const { body, error } = await xooxFetch<{ data: AttributeValueItemType }>(
    'attribute_values',
    {
      method: 'POST',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ATTRIBUTE_VALUE]);
  return { data: body, error: null };
};

export const patchAttributeValue = async ({
  id,
  ...bodyData
}: AttributeValueBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: AttributeValueItemType }>(
    `/attribute_values/${id}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ATTRIBUTE_VALUE, `${RVK_ATTRIBUTE_VALUE}_${id}`]);
  return { data: body, error: null };
};

export const deleteAttributeValue = async (id: ID) => {
  const { body, error } = await xooxFetch(`/attribute_values/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ATTRIBUTE_VALUE, `${RVK_ATTRIBUTE_VALUE}_${id}`]);
  return { data: body, error: null };
};

export const getAttributeValueList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<AttributeValueItemType[]>
    >('/attribute_values', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_ATTRIBUTE_VALUE] },
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching attribute-values:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getAttributeValue = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: AttributeValueItemType }>(
      `/attribute_values/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_ATTRIBUTE_VALUE}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching attribute-values:', error);
    return { data: null, error };
  }
};
