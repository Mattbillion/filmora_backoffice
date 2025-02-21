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
  viewBox: [number, number];
}) {
  const styleJson = parseCSS(getStyleStr(templateJSON));

  const limitX = vbw * 0.9;
  const limitY = vbh * 0.9;
  const INITIAL_SCALE = { x: 0.9, y: 0.9 };

  const shapes = templateJSON.map((c) => svgToKonva(c, styleJson));

  const [stageWidth, stageHeight] = (() => {
    if (typeof window === 'undefined') return [vbw, vbh];
    return [window.innerWidth, window.innerHeight];
  })();

  console.log(stageWidth, stageHeight);
  return (
    <XooxStage
      shapes={shapes}
      height={stageHeight}
      width={stageWidth}
      limitX={limitX}
      limitY={limitY}
      scale={INITIAL_SCALE}
      centerCoord={{
        x: stageWidth / 2 - (vbw * INITIAL_SCALE.x) / 2,
        y: stageHeight / 2 - (vbh * INITIAL_SCALE.y) / 2,
      }}
    />
  );
}
