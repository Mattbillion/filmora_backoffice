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

import { SVGJsonType } from '../schema';
import { parseCSS } from '../util';

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
        data-testid={compKey}
        ref={(ref) => {
          if (ref) {
            ref.cache();
          }
        }}
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
    Object.assign(
      {
        'data-testid': compKey,
      },
      properties,
      classStyle,
    ),
    children,
  );

  let transformedChildren: JSX.Element[] = [];

  if (type !== 'text' && tagName !== 'text' && children?.length) {
    for (let i = 0; i < children.length; i++) {
      transformedChildren.push(svgToKonva(children[i], styleJson));
    }
  }

  konvaProps.children = transformedChildren;

  return (
    <KonvaNode
      key={compKey}
      hitStrokeWidth={0}
      listening={false}
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

export const cssToKonvaStyle = (css: string) =>
  parseCSS(css, {
    strokeDasharray: 'dash',
    strokeLinejoin: 'lineJoin',
    strokeLinecap: 'lineCap',
    pathData: 'data',
    textAlign: 'align',
    textBaseline: 'verticalAlign',
  });
