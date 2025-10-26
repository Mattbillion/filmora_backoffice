import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_CREATE_EPISODE, RVK_EPISODES } from './rvk';
import {
  BaseResponseUnionSeriesEpisodeNoneTypeType,
  SeriesEpisodeCreateType,
} from './schema';

// Auto-generated service for create_episode

export async function createEpisode(body: SeriesEpisodeCreateType) {
  const res = await actions.post<BaseResponseUnionSeriesEpisodeNoneTypeType>(
    `/episodes`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CREATE_EPISODE,
    RVK_EPISODES,
    `${RVK_EPISODES}_season_id_${body.season_id}`,
  ]);

  return response;
}
