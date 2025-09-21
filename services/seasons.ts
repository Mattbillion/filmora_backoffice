import * as actions from './api/actions';
import { RVK_SEASONS } from './rvk';
import {
  BaseResponseUnionListSeriesSeasonDictType,
  BaseResponseUnionSeriesSeasonDictType,
} from './schema';

// Auto-generated service for seasons

export async function getSeriesSeasons(
  movieId: string,
  searchParams: {
    page?: number;
    page_size?: number;
  } = {},
) {
  const res = await actions.get<BaseResponseUnionListSeriesSeasonDictType>(
    `/seasons/${movieId}`,
    {
      searchParams,
      next: {
        tags: [RVK_SEASONS, `${RVK_SEASONS}_movieId_${movieId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getSeriesSeason(seasonId: string) {
  const res = await actions.get<BaseResponseUnionSeriesSeasonDictType>(
    `/seasons/${seasonId}/details`,
    {
      next: {
        tags: [RVK_SEASONS, `${RVK_SEASONS}_seasonId_${seasonId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
