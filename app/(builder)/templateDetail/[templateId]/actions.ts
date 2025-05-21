// @ts-ignore
import { parse } from 'svg-parser';

import { xooxFetch } from '@/lib/fetch';
import { ID } from '@/lib/fetch/types';

import { SVGJsonType } from './schema';

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
  const template = body.data[0];
  const templateJSON = template?.layout_svg
    ? parse(template?.layout_svg)
    : null;
  const svgRoot = templateJSON?.children?.[0];
  const viewBox = svgRoot?.properties?.viewBox
    ?.split(' ')
    ?.slice(2, 4)
    ?.map(parseFloat) as [number, number];

  return {
    templateJSON: svgRoot?.children as SVGJsonType[],
    viewBox,
  };
}
