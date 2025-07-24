import Konva from 'konva';
import { z } from 'zod';

export const templateSchema = z.object({
  hall_id: z.number(),
  template_name: z.string(),
  template_desc: z.string(),
  template_order: z.number().optional().default(0),
  status: z.boolean().optional().default(true),
  template_type: z.string().optional().default('json'),
});

export type TemplateBodyType = z.infer<typeof templateSchema>;

export type SVGJsonType = {
  type: string;
  tagName: string;
  properties: Record<string, string>;
  children: SVGJsonType[];
  value?: string;
};

export type StyleObjType = Record<string, any>;
export type ClassObjType = Record<string, StyleObjType>;

export type TemplateType = {
  templateJSON: SVGJsonType[];
  viewBox: [number, number];
};

export type TemplateValidationResult = {
  ticketsChildrenGrouped: boolean;
  svgGrouped: boolean;
};

export type KonvaNode = Konva.Node & { children?: KonvaNode[] };
