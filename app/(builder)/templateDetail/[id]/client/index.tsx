'use client';

import XooxStage from './stage';
import {
  getStyleStr,
  parseCSS,
  type SVGJsonType,
  svgToKonva,
} from './svg-to-konva';

const INITIAL_SCALE = { x: 0.9, y: 0.9 };

export default function Client({
  templateJSON = [],
  viewBox,
}: {
  templateJSON: SVGJsonType[];
  viewBox: [number, number];
}) {
  const [vbw = 1024, vbh = 960] = viewBox;
  const styleJson = parseCSS(getStyleStr(templateJSON));

  const shapes = templateJSON.map((c) => svgToKonva(c, styleJson));

  const [stageWidth, stageHeight] = (() => {
    if (typeof window === 'undefined') return viewBox;
    return [window.innerWidth, window.innerHeight];
  })();

  return (
    <XooxStage
      shapes={shapes}
      height={stageHeight}
      width={stageWidth}
      limitX={vbw * 0.9}
      limitY={vbh * 0.9}
      scale={INITIAL_SCALE}
      viewBox={viewBox}
      centerCoord={{
        x: (stageWidth - vbw * INITIAL_SCALE.x) / 2,
        y: (stageHeight - vbh * INITIAL_SCALE.y) / 2,
      }}
    />
  );
}
