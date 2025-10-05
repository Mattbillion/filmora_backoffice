import * as api from '@/services/api/actions';

import { RVK_IMAGES } from '../rvk';
import { UploadResponse } from './schema';

export async function uploadMedia(formData: FormData) {
  const { body } = await api.post<UploadResponse>('/upload-image', formData, {
    next: {
      tags: [RVK_IMAGES],
    },
  });

  return { body, error: null };
}
