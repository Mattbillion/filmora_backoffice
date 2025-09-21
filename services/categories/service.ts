import { filmoraFetch } from '@/lib/fetch';

import { CategoriesResponse, Category } from './schema';

export async function getCategories(): Promise<Category[]> {
  const { body, error } = await filmoraFetch<CategoriesResponse>(
    '/categories',
    {
      method: 'GET',
      next: { tags: ['categories'] },
    },
  );
  if (error) throw new Error(error);
  return body.data;
}
