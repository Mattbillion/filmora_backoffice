import * as api from '@/services/api/actions';

import { RVK_MEDIA } from '../rvk';
import { UploadResponse } from './schema';

export async function uploadMedia(formData: FormData) {
  const { body } = await api.post<UploadResponse>('/upload-image', formData, {
    next: {
      tags: [RVK_MEDIA],
    },
  });

  return { body, error: null };
}
