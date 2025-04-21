import { xooxFetch } from '@/lib/fetch';
import { ID, PaginatedResType } from '@/lib/fetch/types';
import { QueryParams } from '@/lib/utils';
import { executeRevalidate } from '@/lib/xoox';

import {
  CategoryBodyType,
  CategoryItemType,
  HierarchicalCategory,
  RVK_CATEGORY,
} from './schema';

export const getCategories = async (searchParams?: QueryParams) => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryItemType[]>
    >('/category', {
      method: 'GET',
      searchParams,
      next: { tags: [RVK_CATEGORY] },
    });

    if (error) throw new Error(error);

    return { data: body, total_count: body.total_count };
  } catch (error) {
    console.error(`Error fetching /category:`, error);
    return { data: { data: [], total_count: 0 }, error };
  }
};
export const getHierarchicalCategories = async (isSpecial?: boolean) => {
  let searchParams: QueryParams = { page_size: 100000 };
  if (isSpecial) searchParams.filters = 'special=true';
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryItemType[]>
    >('/category', {
      method: 'GET',
      searchParams,
      next: { tags: [`${RVK_CATEGORY}_hierarchical`] },
    });

    if (error) throw new Error(error);

    return {
      data: buildCategoryHierarchy(body.data || []),
    };
  } catch (error) {
    console.error(`Error fetching getHierarchicalCategories`, error);
    return { data: [], error };
  }
};

export const getCategoriesHash = async () => {
  try {
    const { body, error } = await xooxFetch<
      PaginatedResType<CategoryItemType[]>
    >('/category', {
      method: 'GET',
      searchParams: { page_size: 100000 },
      next: { tags: [`${RVK_CATEGORY}_hierarchical`] },
    });

    if (error) throw new Error(error);

    return {
      data: (body.data || []).reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur.cat_name }),
        {},
      ) as Record<ID, string>,
    };
  } catch (error) {
    console.error(`Error fetching getCategoriesHash`, error);
    return { data: {} as Record<ID, string>, error };
  }
};

export const getCategoryDetail = async (param1: string | ID) => {
  try {
    const { body, error } = await xooxFetch<{ data: CategoryItemType }>(
      `/category/${param1}`,
      {
        method: 'GET',
        next: { tags: [`${RVK_CATEGORY}_${param1}`] },
      },
    );

    if (error) throw new Error(error);

    return { data: body };
  } catch (error) {
    console.error(`Error fetching /category/${param1}:`, error);
    return { data: null, error };
  }
};

export const createCategory = async (bodyData: CategoryBodyType) => {
  const { body, error } = await xooxFetch(`/category`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_CATEGORY, `${RVK_CATEGORY}_hierarchical`]);
  return { data: body, error: null };
};

export const patchCategoryDetail = async ({
  id: param1,
  ...bodyData
}: CategoryBodyType & { id: ID }) => {
  const { body, error } = await xooxFetch<{ data: CategoryItemType }>(
    `/category/${param1}`,
    {
      method: 'PUT',
      body: bodyData,
      cache: 'no-store',
    },
  );

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY,
    `${RVK_CATEGORY}_${param1}`,
    `${RVK_CATEGORY}_hierarchical`,
  ]);
  return { data: body, error: null };
};

export const deleteCategoryDetail = async (param1: string | ID) => {
  const { body, error } = await xooxFetch(`/category/${param1}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([
    RVK_CATEGORY,
    `${RVK_CATEGORY}_${param1}`,
    `${RVK_CATEGORY}_hierarchical`,
  ]);
  return { data: body, error: null };
};

function buildCategoryHierarchy(categories: CategoryItemType[]) {
  const categoryMap = new Map();

  for (const category of categories) {
    categoryMap.set(category.id, { ...category, children: [] });
  }

  for (const category of categories) {
    if (category.root !== null) {
      const parent = categoryMap.get(category.root);
      if (parent) parent.children.push(categoryMap.get(category.id));
    }
  }

  for (const category of categoryMap.values()) {
    if (category.children.length > 1) {
      category.children.sort(
        (a: CategoryItemType, b: CategoryItemType) => a.order - b.order,
      );
    }
  }

  const rootCategories = categories
    .filter((category) => category.root === null)
    .map((category) => categoryMap.get(category.id) as HierarchicalCategory);

  rootCategories.sort((a, b) => a.order - b.order);

  for (const level1 of rootCategories) {
    for (const level2 of level1.children) {
      for (const level3 of level2.children) {
        level3.children = [];
      }
    }
  }

  return rootCategories;
}
