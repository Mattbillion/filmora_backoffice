'use client';

import { Fragment, JSX } from 'react';
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
import Konva from 'konva';

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

export const svgToKonva = (
  svgJson: SVGJsonType,
  styleJson: Record<string, Record<string, string | number>>,
) => {
  const { type, tagName, properties, children, value } = svgJson;
  const classStyle = styleJson[properties?.class] || {};
  const compKey = type + tagName + Math.random().toString(36);

  if (type === 'text') {
    const textVal = children?.[0]?.children?.[0]?.properties?.value || value;
    return (
      <Text
        key={compKey}
        text={textVal || ''}
        x={parseFloat(properties?.x || '0')}
        y={parseFloat(properties?.y || '0')}
        fontSize={parseFloat(
          (properties || {})['font-size'] ||
            ((classStyle.fontSize as number) || '')?.toString() ||
            '12',
        )}
        fill={(classStyle.fill as string) || properties?.fill}
        listening={false}
        hitStrokeWidth={0}
        shadowForStrokeEnabled={false}
        strokeHitEnabled={false}
      />
    );
  }

  const KonvaNode = elMap[tagName];

  if (!KonvaNode) {
    console.warn(`Unsupported SVG element: ${tagName}`);
    return <Fragment key={compKey} />;
  }

  const konvaProps: Record<string, any> = propertyToProp(
    tagName,
    Object.assign({}, properties, classStyle),
    children,
  );

  let transformedChildren: JSX.Element[] = [];

  if (type !== 'text' && tagName !== 'text' && children?.length) {
    for (let i = 0; i < children.length; i++) {
      transformedChildren.push(svgToKonva(children[i], styleJson));
    }
  }

  konvaProps.children = transformedChildren;

  const forceCache =
    properties.id === 'bg' ||
    properties.id === 'background' ||
    properties.id === 'mask';
  const isTextNode = tagName === 'text' || tagName === 'tspan';

  return (
    <KonvaNode
      ref={(ref?: Konva.Node) => {
        if (ref) {
          const canCache =
            ref.findAncestor('#tickets') &&
            ref.getType() === 'Group' &&
            !children?.some((c) => c.tagName === 'g');

          ref.listening(!!ref.findAncestor('#tickets') && !isTextNode);
          if (forceCache || canCache) {
            if (canCache) ref.name('cachedGroup');
            (ref as unknown as Konva.Node).cache({
              imageSmoothingEnabled: false,
              hitCanvasPixelRatio: 0.7,
              // drawBorder: canCache,
            });
          }
        }
      }}
      key={compKey}
      listening={!forceCache && !isTextNode}
      hitStrokeWidth={0}
      shadowForStrokeEnabled={false}
      {...konvaProps}
    />
  );
};

const propertyToProp = (
  tagName: string,
  properties: Record<string, any> = {},
  children: SVGJsonType[],
) => {
  const konvaProps: Record<string, any> = Object.assign(
    { children },
    properties,
  );

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
      konvaProps.points = properties.points?.split(/[\s,]+/).map(parseFloat);
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
      konvaProps.text =
        children?.[0]?.value ||
        children?.[0]?.children?.[0]?.value ||
        children?.[0]?.children?.[0]?.properties?.value ||
        '';
      konvaProps.x = parseFloat(properties.x || '0');
      konvaProps.y = parseFloat(properties.y || '0');
      konvaProps.fontSize = parseFloat(properties.fontSize || '12');
      konvaProps.fill = properties.fill;
      break;
  }

  if (properties.transform) {
    const transforms: string[] = properties.transform.split(/\)\s+/);

    for (let i = 0; i < transforms.length; i++) {
      const transform = transforms[i];
      const [transformType, values] = transform.split('(');
      const nums = values
        .replace(')', '')
        .split(' ')
        .map((c: string) => parseFloat(c.replace(',', '')));

      switch (transformType.replace(')', '')) {
        case 'translate':
          konvaProps.x = nums[0];
          konvaProps.y = nums[1] - (properties.fontSize || 12) * 0.8;
          break;

        case 'rotate':
          konvaProps.rotation = nums[0];
          break;

        case 'scale':
          konvaProps.scaleX = nums[0];
          konvaProps.scaleY = nums[1] || nums[0];
          break;

        case 'skew':
          konvaProps.skewX = nums[0];
          konvaProps.skewY = nums[1] || nums[0];
          break;

        case 'skewX':
          konvaProps.skewX = nums[0];
          break;

        case 'skewY':
          konvaProps.skewY = nums[0];
          break;
      }
    }
  }

  return konvaProps;
};

type StyleObjType = Record<string, any>;
type ClassObjType = Record<string, StyleObjType>;

const konvaStyleKeyMap: Record<string, string> = {
  strokeDasharray: 'dash',
  strokeLinejoin: 'lineJoin',
  strokeLinecap: 'lineCap',
  pathData: 'data',
  textAlign: 'align',
  textBaseline: 'verticalAlign',
};

export const parseCSS = (css: string): ClassObjType => {
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
        const transformedKey = konvaStyleKeyMap[camelKey] || camelKey;

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

const transformValue = (key: string, value: string) => {
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
