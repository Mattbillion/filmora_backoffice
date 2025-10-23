import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_UPLOAD_IMAGE } from './rvk';
import { BaseResponseDictType, BodyDashboardUploadImageType } from './schema';

// Auto-generated service for upload-image

export async function uploadImage(body: BodyDashboardUploadImageType) {
  const res = await actions.post<BaseResponseDictType>(`/upload-image`, body);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_UPLOAD_IMAGE]);

  return response;
}
