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
  hasBg: boolean;
  hasTickets: boolean;
  hasMask: boolean;
  ticketsChildrenGrouped: boolean;
  svgGrouped: boolean;
};
