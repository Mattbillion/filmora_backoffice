'use client';

import { Fragment } from 'react';
import {
  Circle,
  Ellipse,
  Group,
  Image,
  KonvaNodeComponent,
  Label,
  Line,
  Path,
  Rect,
  Ring,
  Text,
} from 'react-konva';
import { camelCase } from 'change-case-all';

export type SVGJsonType = {
  type: string;
  tagName: string;
  properties: Record<string, string>;
  children: SVGJsonType[];
  value?: string;
};

const elMap: Record<string, KonvaNodeComponent<any, any>> = {
  circle: Circle,
  ellipse: Ellipse,
  g: Group,
  image: Image,
  label: Label,
  line: Line,
  path: Path,
  rect: Rect,
  polygon: Line,
  ring: Ring,
  text: Text,
  tspan: Text,
};

const propertyToProp = (
  tagName: string,
  properties: Record<string, any>,
  children: SVGJsonType[],
) => {
  const konvaProps: Record<string, any> = {};

  switch (tagName.toLowerCase()) {
    case 'rect':
      konvaProps.width = parseFloat(properties.width || '0');
      konvaProps.height = parseFloat(properties.height || '0');
      break;

    case 'circle':
      konvaProps.radius = parseFloat(properties.r || '0');
      break;

    case 'path':
      konvaProps.data = properties.d;
      break;

    case 'image':
      konvaProps.image = new window.Image();
      konvaProps.image.src = properties.href || '';
      break;

    case 'polygon':
      konvaProps.sceneFunc = (context: any, shape: any) => {
        context.beginPath();
        const points = properties.points?.split(/[\s,]+/).map(parseFloat);
        context.moveTo(points[0], points[1]);
        for (let i = 2; i < points.length; i += 2) {
          context.lineTo(points[i], points[i + 1]);
        }
        context.closePath();
        context.fillStrokeShape(shape);
      };
      break;
    case 'text':
      konvaProps.text = children?.[0]?.children?.[0]?.properties?.value || '';
      konvaProps.x = parseFloat(properties?.x || '0');
      konvaProps.y = parseFloat(properties?.y || '0');
      konvaProps.fontSize = parseFloat((properties || {})['font-size'] || '12');
      konvaProps.fill = properties?.fill;
      break;
  }

  if (properties.transform) {
    const transforms: string[] = properties.transform.split(/\)\s+/);
    transforms.forEach((transform) => {
      const [transformType, values] = transform.split('(') as any;
      const nums = values
        .replace(/[^0-9.,-]/g, '')
        .split(/,\s*/)
        .map(parseFloat);

      switch (transformType) {
        case 'translate':
          konvaProps.x = (konvaProps.x || 0) + (nums[0] || 0);
          konvaProps.y = (konvaProps.y || 0) + (nums[1] || 0);
          break;

        case 'rotate':
          konvaProps.rotation = nums[0];
          break;

        case 'scale':
          konvaProps.scaleX = nums[0];
          konvaProps.scaleY = nums[1] || nums[0];
          break;
      }
    });
  }

  return konvaProps;
};

export const svgToKonva = (
  svgJson: SVGJsonType,
  styleJson: Record<string, Record<string, string | number>>,
) => {
  const { type, tagName, properties, children, value } = svgJson;
  const classStyle = styleJson[properties?.class] || {};

  if (type === 'text') {
    const textVal = children?.[0]?.children?.[0]?.properties?.value || value;
    return (
      <Text
        key={Math.random().toString()}
        text={textVal || ''}
        x={parseFloat(properties?.x || '0')}
        y={parseFloat(properties?.y || '0')}
        fontSize={parseFloat(
          (properties || {})['font-size'] ||
            ((classStyle.fontSize as number) || '')?.toString() ||
            '12',
        )}
        fill={(classStyle.fill as string) || properties?.fill}
      />
    );
  }

  const KonvaComponent = elMap[tagName?.toLowerCase()];
  if (!KonvaComponent) {
    console.warn(`Unsupported SVG element: ${tagName}`);
    return <Fragment key={Math.random().toString()} />;
  }

  const konvaProps: Record<string, any> = {
    ...properties,
    ...propertyToProp(tagName, properties, children),
    ...classStyle,
    children: (type === 'text' || tagName === 'text' ? [] : children).map((c) =>
      svgToKonva(c, styleJson),
    ),
  };

  return <KonvaComponent key={Math.random().toString()} {...konvaProps} />;
};

export const getStyleStr = (json: SVGJsonType[]): string => {
  const jsonLength = json.length;

  for (let i = 0; i < jsonLength; i++) {
    const item = json[i];

    if (item.tagName === 'style') return item.children?.[0]?.value || '';

    if (item.children?.length) {
      const result = getStyleStr(item.children);
      if (result) return result;
    }
  }

  return '';
};

type StyleObjType = Record<string, any>;
type ClassObjType = Record<string, StyleObjType>;

export const parseCSS = (css: string): ClassObjType => {
  const styles: ClassObjType = {};
  const regex = /\.([\w-]+(?:,\s*\.[\w-]+)*)\s*\{([^}]+)}/g; // .cls-any {...} or .csl-s, .cls-sda {...}
  let match;

  while ((match = regex.exec(css)) !== null) {
    const classNames = match[1]
      .split(',')
      .map((className) => className.trim().replace('.', ''));

    const rules = match[2].split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map((s) => s.trim());

      if (key && value) {
        let transformedValue = value
          .replace(/\.(\d+)/g, '0.$1')
          .replace(/px$/, '');

        const camelKey = camelCase(key);
        const transformedKey =
          camelKey === 'strokeDasharray' ? 'dash' : camelKey;

        acc[transformedKey] = isNaN(Number(transformedValue))
          ? transformedKey === 'dash'
            ? transformedValue.split(' ')
            : transformedValue
          : Number(transformedValue);
      }

      return acc;
    }, {} as StyleObjType);

    for (let i = 0; i < classNames.length; i++) {
      const className = classNames[i];
      styles[className] = { ...(styles[className] || {}), ...rules };
    }
  }

  return styles;
};
