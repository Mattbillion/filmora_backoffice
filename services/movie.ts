import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_MOVIE } from './rvk';
import {
  FastapiCompatV2BodyDashboardUploadVideo_2Type,
  TaskResponseType,
  TaskStatusResponseType,
} from './schema';

// Auto-generated service for movie

export async function uploadVideo(
  body: FastapiCompatV2BodyDashboardUploadVideo_2Type,
) {
  const res = await actions.post<TaskResponseType>(`/movie/upload`, body);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_MOVIE]);

  return response;
}

export async function getTaskStatus(taskId: string) {
  const res = await actions.get<TaskStatusResponseType>(
    `/movie/status/${taskId}`,
    {
      next: {
        tags: [RVK_MOVIE, `${RVK_MOVIE}_task_id_${taskId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
