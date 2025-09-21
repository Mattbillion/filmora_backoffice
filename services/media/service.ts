import * as api from '@/services/api/actions';

import { UploadResponse } from './schema';

export async function uploadMedia(formData: FormData) {
  const { body, error } = await api.post<UploadResponse>(
    '/upload-image',
    formData,
  );
  if (error) {
    throw new Error(error);
  }
  return { body, error: null };
}
