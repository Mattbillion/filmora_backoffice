import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { RVK_TEMPLATES, TemplatesBodyType, TemplatesItemType } from './schema';

export const getTemplates = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<TemplatesItemType[]>
    >('/templates', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_TEMPLATES] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /templates:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const createTemplates = async (bodyData: TemplatesBodyType) => {
  const { body, error } = await xooxFetch(`/templates`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TEMPLATES]);
  return { data: body, error: null };
};

export const deleteTemplatesDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/templates/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TEMPLATES, `${RVK_TEMPLATES}_${param1}`]);
  return { data: body, error: null };
};
