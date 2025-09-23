import * as actions from './api/actions';
import { RVK_GENRES } from './rvk';
import { BaseResponseUnionListGenreResponseNoneTypeType } from './schema';

// Auto-generated service for genres

export async function getGenres(
  searchParams: {
    page?: number;
    page_size?: number;
  } = {},
) {
  const res = await actions.get<BaseResponseUnionListGenreResponseNoneTypeType>(
    `/genres`,
    {
      searchParams,
      next: {
        tags: [RVK_GENRES],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
