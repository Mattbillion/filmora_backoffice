import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { INITIAL_PAGINATION, QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { BannerBodyType, BannerItemType, RVK_BANNER } from './schema';

export const createBanner = async (bodyData: BannerBodyType) => {
  const { body, error } = await xooxFetch<{ data: BannerItemType }>('banners', {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BANNER]);
  return { data: body, error: null };
};

export const patchBanner = async ({
  id,
  ...bodyData
}: BannerBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: BannerItemType }>(
    `/banners/${id}`,
    {
      method: 'PATCH',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_BANNER, `${RVK_BANNER}_${id}`]);
  return { data: body, error: null };
};

export const deleteBanner = async (id: ID) => {
  const { body, error } = await xooxFetch(`/banners/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BANNER, `${RVK_BANNER}_${id}`]);
  return { data: body, error: null };
};

export const getBannerList = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<PaginatedResType<BannerItemType[]>>(
      '/banners',
      {
        method: 'GET',
        searchParams,
        next: { tags: [RVK_BANNER] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching banners:', error);
    return { data: { data: [], pagination: INITIAL_PAGINATION }, error };
  }
};

export const getBanner = async (id: string) => {
  try {
    const { body, error } = await xooxFetch<{ data: BannerItemType }>(
      `/banners/${id}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_BANNER}_${id}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error('Error fetching banners:', error);
    return { data: null, error };
  }
};
