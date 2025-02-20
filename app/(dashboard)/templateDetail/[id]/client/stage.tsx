'use client';

import { JSX, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';

export default function XooxStage({
  height,
  width,
  limitX,
  limitY,
  shapes,
  centerCoord,
  scale,
}: {
  height: number;
  width: number;
  limitX: number;
  limitY: number;
  shapes: JSX.Element[];
  centerCoord: { x: number; y: number };
  scale: { x: number; y: number };
}) {
  const stageRef = useRef<Konva.Stage | null>(null);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const minScale = 0.2;
    const maxScale = 10;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const pointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.setPosition({
      x: pointer.x - pointTo.x * clampedScale,
      y: pointer.y - pointTo.y * clampedScale,
    });
  };
  return (
    <>
      <button
        onClick={() => {
          console.log(
            'path',
            stageRef.current?.find('Line')[0]?.setAttrs({ fill: 'red' }),
          );
        }}
      >
        Paint first Line element to red
      </button>
      <Stage
        ref={stageRef}
        width={height}
        height={width}
        draggable
        scale={scale}
        x={centerCoord.x}
        y={centerCoord.y}
        onWheel={handleWheel}
        dragBoundFunc={(pos) => {
          const currentScale = stageRef.current?.scaleX() || scale.x;
          const scaledLimit = {
            x: limitX * currentScale,
            y: limitY * currentScale,
          };
          const newX = Math.max(-scaledLimit.x, Math.min(pos.x, scaledLimit.x));
          const newY = Math.max(-scaledLimit.y, Math.min(pos.y, scaledLimit.y));

          return { x: newX, y: newY };
        }}
      >
        <Layer>{shapes}</Layer>
      </Stage>
    </>
  );
}
