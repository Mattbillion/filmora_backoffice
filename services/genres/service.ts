import { QueryParams } from '@/lib/utils';

import * as actions from '../api/actions';
import { executeRevalidate } from '../api/helpers';
import { ID, PaginatedResType } from '../api/types';
import { GenresBodyType, GenresItemType, RVK_GENRES } from './schema';

type GenresQueryParams = QueryParams & {
  return_columns?: (keyof GenresItemType)[];
};

export const getGenres = async (searchParams: GenresQueryParams) => {
  try {
    const res = await actions.get<PaginatedResType<GenresItemType[]>>(
      '/genres',
      {
        searchParams,
        next: { tags: [RVK_GENRES] },
      },
    );
    const { body, error } = res;
    if (error) throw new Error(error);
    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /genres:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getGenresDetail = async (
  param1: string | ID,
  returnColumns: GenresQueryParams['return_columns'],
) => {
  try {
    const res = await actions.get<{ data: GenresItemType }>(
      `/genres/${param1}`,
      {
        ...(returnColumns
          ? { searchParams: { return_columns: returnColumns } }
          : {}),
        next: { tags: [`${RVK_GENRES}_${param1}`] },
      },
    );
    const { body, error } = res;
    if (error) throw new Error(error);
    return { data: body };
  } catch (error) {
    console.error(`Error fetching /genres/${param1}:`, error);
    return { data: null, error };
  }
};

export const createGenres = async (bodyData: GenresBodyType) => {
  const res = await actions.post(`/genres`, bodyData);
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_GENRES]);
  return { data: body, error: null };
};

export const patchGenresDetail = async ({
  id: param1,
  ...bodyData
}: GenresBodyType & { id: ID }) => {
  const res = await actions.put<{ data: GenresItemType }>(
    `/genres/${param1}`,
    bodyData,
  );
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_${param1}`]);
  return { data: body, error: null };
};

export const deleteGenresDetail = async (param1: string | ID) => {
  const res = await actions.destroy(`/genres/${param1}`);
  const { body, error } = res;
  if (error) throw new Error(error);
  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_${param1}`]);
  return { data: body, error: null };
};
