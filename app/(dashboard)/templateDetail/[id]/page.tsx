// @ts-ignore
import { parse } from 'svg-parser';

import { xooxFetch } from '@/lib/fetch';

import Client from './client';

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

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { body } = await xooxFetch<{ data: TemplateDetail[] }>('templates');
  const template = body.data[0];
  const templateJSON = parse(template.layout_svg || '');
  const svgRoot = templateJSON?.children?.[0];
  const viewBox = svgRoot?.properties?.viewBox
    ?.split(' ')
    ?.slice(2, 4)
    ?.map(parseFloat);

  console.log(templateJSON);
  return <Client templateJSON={svgRoot?.children} viewBox={viewBox || []} />;
}
