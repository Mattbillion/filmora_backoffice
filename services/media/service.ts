import * as api from '@/services/api/actions';

import { UploadResponse } from './schema';

export async function uploadMedia(formData: FormData) {
  const { body } = await api.post<UploadResponse>('/upload-image', formData);

  return { body, error: null };
}
