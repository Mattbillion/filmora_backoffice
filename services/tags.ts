import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_TAGS } from './rvk';
import {
  AppModelsBaseBaseResponseUnionListTagResponseNoneType_1Type,
  BaseResponseUnionDictNoneTypeType,
  BaseResponseUnionTagResponseNoneTypeType,
  TagCreateType,
  TagUpdateType,
} from './schema';

// Auto-generated service for tags

export type GetTagsSearchParams = {
  page?: number;
  page_size?: number;
};

export async function getTags(searchParams?: GetTagsSearchParams) {
  const res =
    await actions.get<AppModelsBaseBaseResponseUnionListTagResponseNoneType_1Type>(
      `/tags`,
      {
        searchParams,
        next: {
          tags: [RVK_TAGS],
        },
      },
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function createTag(body: TagCreateType) {
  const res = await actions.post<BaseResponseUnionTagResponseNoneTypeType>(
    `/tags`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function getTag(tagId: number) {
  const res = await actions.get<BaseResponseUnionTagResponseNoneTypeType>(
    `/tags/${tagId}`,
    {
      next: {
        tags: [RVK_TAGS, `${RVK_TAGS}_tag_id_${tagId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateTag(tagId: number, body: TagUpdateType) {
  const res = await actions.put<BaseResponseUnionTagResponseNoneTypeType>(
    `/tags/${tagId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_TAGS, `${RVK_TAGS}_tag_id_${tagId}`]);

  return response;
}

export async function deleteTag(tagId: number) {
  const res = await actions.destroy<BaseResponseUnionDictNoneTypeType>(
    `/tags/${tagId}`,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_TAGS, `${RVK_TAGS}_tag_id_${tagId}`]);

  return response;
}
