import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_UPLOAD_VIDEO } from './rvk';
import {
  BaseResponseUnionDictStrAnyNoneTypeType,
  FastapiCompatV2BodyDashboardUploadVideoType,
} from './schema';

// Auto-generated service for upload-video

export async function uploadVideo(
  body: FastapiCompatV2BodyDashboardUploadVideoType,
) {
  const res = await actions.post<BaseResponseUnionDictStrAnyNoneTypeType>(
    `/upload-video`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_UPLOAD_VIDEO]);

  return response;
}
