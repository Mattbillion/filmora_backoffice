import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_CREATE_EPISODE } from './rvk';
import { EpisodeUploadInitializeType } from './schema';

// Auto-generated service for create_episode

export async function createEpisode(
  seasonId: string,
  body: EpisodeUploadInitializeType,
) {
  const res = await actions.post<any>(`/create_episode/${seasonId}`, body);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CREATE_EPISODE,
    `${RVK_CREATE_EPISODE}_season_id_${seasonId}`,
  ]);

  return response;
}
