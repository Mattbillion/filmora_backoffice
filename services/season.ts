import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_SEASON } from './rvk';
import {
  BaseResponseDictType,
  BaseResponseUnionSeriesSeasonNoneTypeType,
  SeriesSeasonCreateType,
  SeriesSeasonUpdateType,
} from './schema';

// Auto-generated service for season

export async function createSeriesSeason(
  movieId: string,
  body: SeriesSeasonCreateType,
) {
  const res = await actions.post<BaseResponseUnionSeriesSeasonNoneTypeType>(
    `/seasons/${movieId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_SEASON]);
  return response;
}

export async function updateSeriesSeason(
  seasonId: string,
  body: SeriesSeasonUpdateType,
) {
  const res = await actions.put<BaseResponseUnionSeriesSeasonNoneTypeType>(
    `/seasons/${seasonId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  await executeRevalidate([RVK_SEASON, `${RVK_SEASON}_season_id_${seasonId}`]);

  return response;
}

export async function deleteSeriesSeason(seasonId: string) {
  const res = await actions.destroy<BaseResponseDictType>(
    `/season/${seasonId}`,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_SEASON, `${RVK_SEASON}_season_id_${seasonId}`]);

  return response;
}
