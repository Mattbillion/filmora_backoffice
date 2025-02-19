'use client';

import { Layer, Stage } from 'react-konva';

import {
  getStyleStr,
  parseCSS,
  type SVGJsonType,
  svgToKonva,
} from './svg-to-konva';

export default function Client({
  templateJSON,
}: {
  templateJSON: SVGJsonType[];
}) {
  const styleJson = parseCSS(getStyleStr(templateJSON));
  const konvaList = templateJSON.map((c) => svgToKonva(c, styleJson));

  return (
    <Stage width={768} height={866.35} draggable>
      <Layer clearBeforeDraw>{konvaList}</Layer>
    </Stage>
  );
}
