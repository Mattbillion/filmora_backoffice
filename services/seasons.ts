import * as actions from './api/actions';
import { RVK_SEASONS } from './rvk';
import {
  InitialResponseUnionSeriesSeasonListType,
  InitialResponseUnionSeriesSeasonNoneTypeType,
} from './schema';

// Auto-generated service for seasons

export type GetSeriesSeasonsSearchParams = {
  page?: number;
  page_size?: number;
};

export async function getSeriesSeasons(
  movieId: string,
  searchParams?: GetSeriesSeasonsSearchParams,
) {
  const res = await actions.get<InitialResponseUnionSeriesSeasonListType>(
    `/seasons/${movieId}`,
    {
      searchParams,
      next: {
        tags: [RVK_SEASONS, `${RVK_SEASONS}_movie_id_${movieId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getSeriesSeason(seasonId: string) {
  const res = await actions.get<InitialResponseUnionSeriesSeasonNoneTypeType>(
    `/seasons/${seasonId}/details`,
    {
      next: {
        tags: [RVK_SEASONS, `${RVK_SEASONS}_season_id_${seasonId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
