import { RVK_TEMPLATES } from '@/app/(dashboard)/events/[id]/templates/schema';
import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';
import { executeRevalidate } from '@/lib/xoox';

type TemplateDetail = {
  id: number;
  venue_id: number;
  branch_id: number;
  hall_id: number;
  template_name: string;
  template_desc: string;
  template_order: number;
  layout_svg: string;
  status: boolean;
  created_at: string;
  updated_at: null | string;
  created_employee: string;
};

export async function getTemplateDetail(templateId: ID) {
  const { body } = await xooxFetch<{ data: TemplateDetail[] }>(`/templates`);

  return body.data[0]?.layout_svg;
}

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
