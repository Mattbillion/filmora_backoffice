import * as actions from '../api/actions';
import {
  BaseResponseUnionDictNoneTypeType,
  BodyDashboardUploadVideoType,
} from './schema';

// Auto-generated service for upload-video

export async function uploadVideo(body: BodyDashboardUploadVideoType) {
  const res = await actions.post<BaseResponseUnionDictNoneTypeType>(
    `/upload-video`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}
