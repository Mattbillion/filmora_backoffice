import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import { BannersBodyType, BannersItemType, RVK_BANNERS } from './schema';

export const getBanners = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<BannersItemType[]>
    >('/banners', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_BANNERS] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /banners:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};

export const getBannersDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: BannersItemType }>(
      `/banners/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_BANNERS}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /banners/${param1}:`, error);
    return { data: null, error };
  }
};

export const createBanners = async (bodyData: BannersBodyType) => {
  const { body, error } = await xooxFetch(`/banners`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BANNERS]);
  return { data: body, error: null };
};

export const patchBannersDetail = async ({
  id: param1,
  ...bodyData
}: BannersBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: BannersItemType }>(
    `/banners/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([RVK_BANNERS, `${RVK_BANNERS}_${param1}`]);
  return { data: body, error: null };
};

export const deleteBannersDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/banners/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_BANNERS, `${RVK_BANNERS}_${param1}`]);
  return { data: body, error: null };
};
