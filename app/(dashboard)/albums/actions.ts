import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { AlbumBodyType, AlbumItemType,RVK_ALBUM } from './schema';

export const createAlbum = async (bodyData: AlbumBodyType) => {
  const { body, error } = await xooxFetch<{ data: AlbumItemType }>('album', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ALBUM]);
  executeRevalidate([{ tag: 'albums' }, { path: `/albums/${body.data.id}` }]);
  return { data: body, error: null };
};

export const patchAlbum = async ({
  id,
  ...bodyData
}: AlbumBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: AlbumItemType }>(
    `/album/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_ALBUM, `${RVK_ALBUM}_${id}`]);
  executeRevalidate([{ tag: 'albums' }, { path: `/albums/${id}` }]);
  return { data: body, error: null };
};

export const deleteAlbum = async (id: ID) => {
  const { body, error } = await xooxFetch(`/album/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_ALBUM, `${RVK_ALBUM}_${id}`]);
  executeRevalidate([{ tag: 'albums' }, { path: `/albums/${id}` }]);
  return { data: body, error: null };
};

export const getAlbums = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<AlbumItemType[]>>(
      '/album',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_ALBUM] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching albums:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getAlbum = async (albumId: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: AlbumItemType }>(
      `/album/${albumId}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_ALBUM}_${albumId}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching albums:', error);
    return { data: null, error };
  }
};
