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

const isGroupElement = (el: SVGJsonType) =>
  typeof el === 'object' && el.tagName === 'g' && el.type === 'element';
const INITIAL_GROUP_COUNT = 2;

const sda = (arr: any = [], depth = 0) => {
  for (let j = 0; j < arr?.length || 0; j++) {
    const child = arr[j];
    if (depth > 10) break;
    if (isGroupElement(child)) {
      depth += 1;
      sda(child.children, depth);
    }
  }
  return depth;
};

export function validateSVG(arr: SVGJsonType[]): TemplateValidationResult {
  let ticketsChildrenGrouped = false;
  const slicedArr = arr.slice(0, 10);
  const depth1Groups = slicedArr.filter((c) => isGroupElement(c)).length;
  const svgGrouped = depth1Groups >= INITIAL_GROUP_COUNT;

  if (svgGrouped) {
    for (let i = 0; i < slicedArr.length; i++) {
      const node = slicedArr[i];
      const groupCountAccepted =
        Array.isArray(node.children) &&
        node.children.reduce(
          (acc, cur) => (acc += isGroupElement(cur) ? 1 : 0),
          0,
        ) >= 2;
      let depthGroup = sda(node.children, 0) >= 2;

      ticketsChildrenGrouped = groupCountAccepted && depthGroup;
      if (ticketsChildrenGrouped) break;
    }
  }

  return {
    ticketsChildrenGrouped,
    svgGrouped,
  };
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

export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
