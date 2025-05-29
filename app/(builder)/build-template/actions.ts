import { RVK_TEMPLATES } from '@/app/(dashboard)/events/[id]/templates/schema';
import { xooxFetch } from '@/lib/fetch';
import { executeRevalidate } from '@/lib/xoox';

export const createTemplate = async (bodyData: FormData) => {
  const { body, error } = await xooxFetch<{ data: number }>(`/templates`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TEMPLATES]);
  return { data: body, error: null };
};

export const uploadTemplateJSON = async (bodyData: FormData) => {
  const { body, error } = await xooxFetch(`/upload-template-files`, {
    method: 'POST',
    body: bodyData,
    cache: 'no-store',
  });

  if (error) throw new Error(error);

  executeRevalidate([RVK_TEMPLATES]);
  return { data: body, error: null };
};
