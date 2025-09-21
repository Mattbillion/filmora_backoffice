import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_VIDEOS } from './rvk';
import { BaseResponseUnionListDictNoneTypeType } from './schema';

// Auto-generated service for videos

export async function getVideos() {
  const res = await actions.get<BaseResponseUnionListDictNoneTypeType>(
    `/videos`,
    {
      next: {
        tags: [RVK_VIDEOS],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function deleteVideo(jobId: string) {
  const res = await actions.destroy<any>(`/videos/${jobId}`);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_VIDEOS, `${RVK_VIDEOS}_jobId_${jobId}`]);

  return response;
}
