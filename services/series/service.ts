import { QueryParams } from '@/lib/utils';

import * as actions from '../api/actions';
import { executeRevalidate } from '../api/helpers';
import { ID, PaginatedResType } from '../api/types';
import { RVK_SERIES, SeriesBodyType, SeriesItemType } from './schema';

// Fallback minimal implementations (no rawData)
export const createSeries = async (bodyData: SeriesBodyType) => {
  const res = await actions.post(`/series`, bodyData);
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_SERIES]);
  return { data: body, error: null };
};

export const patchSeriesDetail = async ({
  id: param1,
  ...bodyData
}: SeriesBodyType & { id: ID }) => {
  const res = (await actions.put(`/series/${param1}`, bodyData)) as {
    body: { data: SeriesItemType };
    error?: string;
  };
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_SERIES, RVK_SERIES + '_' + String(param1)]);
  return { data: body, error: null };
};

export const deleteSeriesDetail = async (param1: string | ID) => {
  const res = await actions.destroy(`/series/${param1}`);
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_SERIES, RVK_SERIES + '_' + String(param1)]);
  return { data: body, error: null };
};

export const getSeries = async (searchParams?: QueryParams) => {
  try {
    const res = await actions.get<PaginatedResType<SeriesItemType[]>>(
      '/series',
      {
        searchParams,
        next: { tags: [RVK_SERIES] },
      },
    );
    const { body, error } = res;
    if (error) throw new Error(error);
    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error('Error fetching series:', error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getSeriesDetail = async (id: string) => {
  try {
    const res = await actions.get<{ data: SeriesItemType }>(`/series/${id}`, {
      next: { tags: [RVK_SERIES + '_' + String(id)] },
    });
    const { body, error } = res;
    if (error) throw new Error(error);
    return { data: body };
  } catch (error) {
    console.error('Error fetching series:', error);
    return { data: null, error };
  }
};
