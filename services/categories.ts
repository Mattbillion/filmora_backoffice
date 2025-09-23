import * as actions from './api/actions';
import { RVK_CATEGORIES } from './rvk';
import { BaseResponseListUnionCategoryResponseNoneTypeType } from './schema';

// Auto-generated service for categories

export async function getCategories(
  searchParams: {
    page?: number;
    page_size?: number;
    is_adult?: boolean;
    is_featured?: boolean;
  } = {},
) {
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
