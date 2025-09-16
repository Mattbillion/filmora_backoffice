import { QueryParams } from '@/lib/utils';

import * as actions from '../api/actions';
import { executeRevalidate } from '../api/helpers';
import { ID, PaginatedResType } from '../api/types';
import { GenresBodyType, GenresItemType, RVK_GENRES } from './schema';

export const getGenres = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await actions.get<
      PaginatedResType<GenresItemType[]>
    >('/genres', {
      searchParams,
      next: { tags: [RVK_GENRES] },
    });

    if (error) throw new Error(error);

    console.log(JSON.stringify({ body }));
    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /genres:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getGenresDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await actions.get<{ data: GenresItemType }>(
      `/genres/${param1}`,
      {
        next: { tags: [`${RVK_GENRES}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /genres/${param1}:`, error);
    return { data: null, error };
  }
};

export const createGenres = async (bodyData: GenresBodyType) => {
  const { body, error } = await actions.post(`/genres`, bodyData);

  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES]);
  return { data: body, error: null };
};

export const patchGenresDetail = async ({
  id: param1,
  ...bodyData
}: GenresBodyType & { id: ID }) => {
  const { body, error } = await actions.put<{ data: GenresItemType }>(
    `/genres/${param1}`,
    bodyData,
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_${param1}`]);
  return { data: body, error: null };
};

export const deleteGenresDetail = async (param1: string | ID) => {
  const { body, error } = await actions.destroy(`/genres/${param1}`);

  if (error) throw new Error(error);

  executeRevalidate([RVK_GENRES, `${RVK_GENRES}_${param1}`]);
  return { data: body, error: null };
};

