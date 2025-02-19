'use client';

import { JSX, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';

export default function XooxStage({
  height,
  width,
  limitX,
  limitY,
  stage,
}: {
  height: number;
  width: number;
  limitX: number;
  limitY: number;
  stage: JSX.Element[];
}) {
  const stageRef = useRef<Konva.Stage | null>(null);

  return (
    <Stage
      ref={stageRef}
      width={height}
      height={width}
      draggable
      dragBoundFunc={(pos) => {
        const newX = Math.max(-limitX, Math.min(pos.x, limitX));
        const newY = Math.max(-limitY, Math.min(pos.y, limitY));
        return { x: newX, y: newY };
      }}
    >
      <Layer clearBeforeDraw>{stage}</Layer>
    </Stage>
  );
}
