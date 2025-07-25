import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  RVK_TEMPLATES,
  TemplatesDetailType,
  TemplatesItemType,
} from './schema';

export const getTemplates = async (
  searchParams?: QueryParams,
  cacheKeys: string[] = [],
) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<TemplatesItemType[]>
    >('/templates', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_TEMPLATES, ...cacheKeys] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /templates:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getTemplateHash = async (searchParams: QueryParams = {}) => {
  try {
    const { data } = await getTemplates({ page_size: 10000, ...searchParams }, [
      `${RVK_TEMPLATES}_${Buffer.from(JSON.stringify(searchParams || {})).toString('base64')}`,
    ]);

    return {
      data: (data.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur }),
        {},
      ) as Record<ID, TemplatesItemType>,
    };
  } catch (error) {
    console.error(`Error fetching getTemplatePreviewHash`, error);
    return { data: {} as Record<ID, TemplatesItemType>, error };
  }
};

export const getTemplateDetail = async (templateId: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: TemplatesDetailType }>(
      `/templates/${templateId}`,
      {
        method: 'GET',
        next: { tags: [RVK_TEMPLATES] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /templates:`, error);
    return { data: { data: null }, error };
  }
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
