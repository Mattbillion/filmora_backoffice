import * as actions from '../api/actions';
import { executeRevalidate } from '../api/helpers';
import { ImageListResponseType, RVK_IMAGES } from './schema';

// Auto-generated service for images

export async function getUploadedImages(
  searchParams: {
    page?: number;
    page_size?: number;
    content_type?: string;
  } = {},
) {
  const res = await actions.get<ImageListResponseType>(`/images`, {
    searchParams,
    next: {
      tags: [RVK_IMAGES],
    },
  });

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function deleteImage(imageId: string) {
  const res = await actions.destroy<any>(`/images/${imageId}`);

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_IMAGES, `${RVK_IMAGES}_imageId_${imageId}`]);

  return response;
}
