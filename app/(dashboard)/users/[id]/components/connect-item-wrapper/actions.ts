import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION } from '@/lib/utils';

import { PurchaseTypeEnum } from '../../schema';
import { ConnectProductType, UserType } from './schema';

export const addLecture = async (id: ID, lectureId: ID | string) => {
  const { body, error } = await xooxFetch(`/users/${id}/add-lecture`, {
    method: 'POST',
    body: { lectureId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const addAlbum = async (id: ID, albumId: ID | string) => {
  const { body, error } = await xooxFetch(`/users/${id}/add-album`, {
    method: 'POST',
    body: { albumId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const addTraining = async (
  id: ID,
  packageId: ID | string,
  date?: string,
) => {
  const { body, error } = await xooxFetch(`/users/${id}/add-training`, {
    method: 'POST',
    body: { packageId, date },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const addBook = async (id: ID, bookId: ID | string) => {
  const { body, error } = await xooxFetch(`/users/${id}/add-book`, {
    method: 'POST',
    body: { bookId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const getUser = async (id: ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: UserType }>(
      `/users/${id}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { data: null, error };
  }
};

export const getConnectProducts = async ({
  purchaseType,
  trainingId,
  albumId,
}: {
  purchaseType: PurchaseTypeEnum | 2;
  trainingId?: ID | string;
  albumId?: ID | string;
}) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<ConnectProductType[]>
    >('/users/active/product', {
      method: 'GET',
      searchParams: {
        purchaseType: String(purchaseType),
        limit: 100000,
        trainingId,
        albumId,
      },
      cache: 'no-store',
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};
