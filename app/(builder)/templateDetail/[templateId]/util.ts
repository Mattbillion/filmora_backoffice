import { camelCase } from 'change-case-all';
// @ts-ignore
import { parse as parseSVG } from 'svg-parser';

import {
  ClassObjType,
  StyleObjType,
  SVGJsonType,
  TemplateValidationResult,
} from './schema';

export const svgStrToJSON = (svgStr: string) => {
  const svgJSON = svgStr ? parseSVG(svgStr) : null;

  return {
    templateJSON: svgJSON?.children?.[0]?.children as SVGJsonType[],
    viewBox: svgJSON?.children?.[0]?.properties?.viewBox
      ?.split(' ')
      ?.slice(2, 4)
      ?.map(parseFloat) as [number, number],
  };
};

export function validateSVG(arr: SVGJsonType[]): TemplateValidationResult {
  let ticketsChildrenGrouped = false;
  let svgGrouped = true;

  if (!arr.length || arr.length > 100) svgGrouped = false;
  if (svgGrouped) {
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i];
      const id = node.properties?.id;
      if (id === 'tickets') {
        ticketsChildrenGrouped =
          Array.isArray(node.children) &&
          node.children.every(
            (child) =>
              typeof child === 'object' &&
              child.tagName === 'g' &&
              child.type === 'element',
          );
      }
    }
  }

  return { ticketsChildrenGrouped, svgGrouped };
}

export const parseCSS = (
  css: string,
  styleKeyMap: Record<string, string> = {},
): ClassObjType => {
  const styles: ClassObjType = {};
  const regex = /\.([\w-]+(?:,\s*\.[\w-]+)*)\s*\{([^}]+)}/g; // .cls-any {...} or .csl-s, .cls-sda {...}
  let match;

  while ((match = regex.exec(css)) !== null) {
    const classNames = match[1]
      .split(',')
      .map((className) => className.trim().replace('.', ''));

    const rules: StyleObjType = {};
    const rulesArray = match[2].split(';');

    for (let i = 0; i < rulesArray.length; i++) {
      const rule = rulesArray[i];
      const [key, value] = rule.split(':').map((s) => s.trim());

      if (key && value) {
        const camelKey = camelCase(key);
        const transformedKey = styleKeyMap[camelKey] || camelKey;

        rules[transformedKey] = transformValue(transformedKey, value);
      }
    }

    for (let i = 0; i < classNames.length; i++) {
      const className = classNames[i];
      styles[className] = Object.assign({}, styles[className], rules);
    }
  }

  return styles;
};

export const transformValue = (key: string, value: string) => {
  const v = value.replace(/(\s|,)\.(\d+)/g, '0.$1').replace(/px$/, '');

  if (key === 'dash') return v.split(' ');
  if (key === 'fill' && v === 'none') return 'transparent';
  if (isNaN(Number(v))) return v;
  return Number(v);
};

export const getStyleStr = (json: SVGJsonType[]): string => {
  const jsonLength = json.length;

  for (let i = 0; i < jsonLength; i++) {
    const item = json[i];

    if (item.tagName === 'style') return item.children?.[0]?.value || '';
    if (item.children?.length) return getStyleStr(item.children);
  }

  return '';
};
