import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION } from '@/lib/utils';

import { PurchaseItemType, PurchaseTypeEnum,UserType } from './schema';

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

export const getPurchases = async (searchParams?: {
  userId: ID;
  purchaseType: PurchaseTypeEnum;
}) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<PurchaseItemType[]>
    >(`/users/purchase`, {
      method: 'GET',
      searchParams,
      cache: 'no-store',
    });

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const removeLecture = async (id: ID, productId: ID, purchaseId?: ID) => {
  const { body, error } = await xooxFetch(`/users/${id}/remove-lecture`, {
    method: 'POST',
    body: { productId, purchaseId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const removeAlbum = async (id: ID, productId: ID, purchaseId?: ID) => {
  const { body, error } = await xooxFetch(`/users/${id}/remove-album`, {
    method: 'POST',
    body: { productId, purchaseId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const removeBook = async (id: ID, productId: ID, purchaseId?: ID) => {
  const { body, error } = await xooxFetch(`/users/${id}/remove-book`, {
    method: 'POST',
    body: { productId, purchaseId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};

export const removeTraining = async (
  id: ID,
  productId: ID,
  purchaseId?: ID,
) => {
  const { body, error } = await xooxFetch(`/users/${id}/remove-training`, {
    method: 'POST',
    body: { productId, purchaseId },
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  return { data: body };
};
