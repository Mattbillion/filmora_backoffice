'use client';

import XooxStage from './stage';
import {
  getStyleStr,
  parseCSS,
  type SVGJsonType,
  svgToKonva,
} from './svg-to-konva';

export default function Client({
  templateJSON = [],
  viewBox: [vbw = 1024, vbh = 960],
}: {
  templateJSON: SVGJsonType[];
  viewBox: number[];
}) {
  const styleJson = parseCSS(getStyleStr(templateJSON));
  const limitX = vbw * 0.7;
  const limitY = vbh * 0.7;

  const konvaList = templateJSON.map((c) => svgToKonva(c, styleJson));
  const [stageWidth, stageHeight] = (() => {
    if (typeof window === 'undefined') return [vbw, vbh];
    return [window.innerWidth, window.innerHeight];
  })();

  return (
    <XooxStage
      stage={konvaList}
      height={stageHeight}
      width={stageWidth}
      limitX={limitX}
      limitY={limitY}
    />
  );
}
