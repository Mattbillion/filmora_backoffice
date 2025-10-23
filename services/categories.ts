import * as actions from './api/actions';
import { executeRevalidate } from './api/helpers';
import { RVK_CATEGORIES } from './rvk';
import {
  AppModelsBaseBaseResponseUnionDictNoneTypeType,
  BaseResponseListUnionCategoryResponseNoneTypeType,
  BaseResponseUnionCategoryResponseNoneTypeType,
  CategoryCreateType,
  CategoryUpdateType,
} from './schema';

// Auto-generated service for categories

export type GetCategoriesSearchParams = {
  page?: number;
  page_size?: number;
  is_adult?: boolean;
};

export async function getCategories(searchParams?: GetCategoriesSearchParams) {
  const res =
    await actions.get<BaseResponseListUnionCategoryResponseNoneTypeType>(
      `/categories`,
      {
        searchParams,
        next: {
          tags: [RVK_CATEGORIES],
        },
      },
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function createCategory(body: CategoryCreateType) {
  const res = await actions.post<BaseResponseUnionCategoryResponseNoneTypeType>(
    `/categories`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORIES]);

  return response;
}

export async function getCategory(categoryId: number) {
  const res = await actions.get<BaseResponseUnionCategoryResponseNoneTypeType>(
    `/categories/${categoryId}`,
    {
      next: {
        tags: [RVK_CATEGORIES, `${RVK_CATEGORIES}_category_id_${categoryId}`],
      },
    },
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  return response;
}

export async function updateCategory(
  categoryId: number,
  body: CategoryUpdateType,
) {
  const res = await actions.put<BaseResponseUnionCategoryResponseNoneTypeType>(
    `/categories/${categoryId}`,
    body,
  );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORIES,
    `${RVK_CATEGORIES}_category_id_${categoryId}`,
  ]);

  return response;
}

export async function deleteCategory(categoryId: number) {
  const res =
    await actions.destroy<AppModelsBaseBaseResponseUnionDictNoneTypeType>(
      `/categories/${categoryId}`,
    );

  const { body: response, error } = res;
  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORIES,
    `${RVK_CATEGORIES}_category_id_${categoryId}`,
  ]);

  return response;
}
