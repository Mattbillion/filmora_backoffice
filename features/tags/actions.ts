import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';
import { executeRevalidate } from '@/lib/xoox';

import { RVK_TAG,TagBodyType, TagItemType } from './schema';

export const createTag = async (bodyData: TagBodyType) => {
  const { body, error } = await xooxFetch<{ data: TagItemType }>('/tag', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TAG]);
  executeRevalidate([{ tag: 'tags' }]);
  return { data: body, error };
};

export const patchTag = async ({
  id,
  ...bodyData
}: TagBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: TagItemType }>(`/tag/${id}`, {
    method: 'PATCH',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TAG]);
  executeRevalidate([{ tag: 'tags' }]);
  return { data: body, error };
};

export const deleteTag = async (id: ID) => {
  const { body, error } = await xooxFetch(`/tag/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TAG]);
  executeRevalidate([{ tag: 'tags' }]);
  return { data: body, error: null };
};

export const getTags = async () => {
  try {
    const { body, error } = await xooxFetch<{ data: TagItemType[] }>('/tag', {
      method: 'GET',
      next: { tags: [RVK_TAG] },
    });

    if (error) throw new Error(error);

    return { data: body, error };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { data: { data: [] }, error };
  }
};
