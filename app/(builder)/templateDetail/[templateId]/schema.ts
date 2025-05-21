export type SVGJsonType = {
  type: string;
  tagName: string;
  properties: Record<string, string>;
  children: SVGJsonType[];
  value?: string;
};

export type StyleObjType = Record<string, any>;
export type ClassObjType = Record<string, StyleObjType>;
