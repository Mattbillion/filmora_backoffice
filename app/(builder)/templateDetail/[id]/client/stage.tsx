'use client';

import { JSX, useEffect, useRef } from 'react';
import { Layer, Stage as KonvaStage } from 'react-konva';
import Konva from 'konva';
import { debounce } from 'lodash';

const scaleBy = 1.05;
const maxScale = 10;
const minScale = 0.5;

export default function Stage({
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
  const stageRef = useRef<Konva.Stage>(null);
  const sectionsRef = useRef<Konva.Node[]>([]);

  useEffect(() => {
    if (stageRef.current) {
      sectionsRef.current = stageRef.current.find('.ticketSection');
      console.log('effect');
    }
  });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    e.evt.preventDefault();

    const pointer = stage.getPointerPosition();
    const { scale: newScale, position: newPosition } = getZoomInfo({
      deltaY: e.evt.deltaY,
      stage,
      pointer,
    });

    stage.scale(newScale);
    stage.setPosition(newPosition);

    if (newScale.x > 2 || newScale.y > 2)
      modifyCache({ ...newPosition, scaleX: newScale.x, scaleY: newScale.y });
    else forceCache();
  };

  const modifyCache = debounce(
    (
      newBox: Konva.Vector2d & { scaleX: number; scaleY: number },
      forceCache?: boolean,
    ) => {
      const stage = stageRef.current;
      const visibleNodes = stage?.find('.cachedGroup');
      const nodesLength = visibleNodes?.length;

      if (nodesLength) {
        for (let i = 0; i < nodesLength; i++) {
          const node = visibleNodes[i];

          if (node.isCached()) {
            if (isNodeVisible(node, newBox)) node.clearCache();
          } else if (forceCache) {
            if (!isNodeVisible(node, newBox))
              node.cache({
                // drawBorder: true,
              });
          }
        }
      }
    },
    200,
  );

  const isNodeVisible = (
    node: Konva.Node,
    newBox: Konva.Vector2d & { scaleX: number; scaleY: number },
  ) => {
    const nodeBox = node.getClientRect();
    const highRatio =
      nodeBox.width / nodeBox.height > 5 || nodeBox.height / nodeBox.width > 5;

    const visibleHeight = (nodeBox.y + nodeBox.height) / newBox.scaleY;
    const visibleWidth = (nodeBox.x + nodeBox.width) / newBox.scaleX;
    const isFullyVisible =
      visibleWidth < width / newBox.scaleX &&
      visibleHeight < height / newBox.scaleY;
    const isPartVisible =
      highRatio &&
      (visibleWidth < width / newBox.scaleX ||
        visibleHeight < height / newBox.scaleY);

    return (
      visibleWidth > 0 && visibleHeight > 0 && (isFullyVisible || isPartVisible)
    );
  };

  const forceCache = debounce(() => {
    const visibleNodes = stageRef.current?.find(
      (node: Konva.Shape) => node.name() === 'cachedGroup' && !node.isCached(),
    );
    const nodesLength = visibleNodes?.length;

    if (nodesLength) {
      for (let i = 0; i < nodesLength; i++) {
        visibleNodes[i].cache();
      }
    }
  }, 200);

  const getZoomInfo = ({
    deltaY,
    stage,
    pointer,
  }: {
    deltaY: number;
    stage: Konva.Stage;
    pointer?: Konva.Vector2d | null;
  }): {
    scale: Konva.Vector2d;
    position: Konva.Vector2d;
    miniMapSize?: { scale: Konva.Vector2d; position: Konva.Vector2d };
  } => {
    const oldScale = stage.scaleX();
    const newScale = deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));
    const zoomInfo = {
      scale: { x: clampedScale, y: clampedScale },
      position: {
        x: stage.x(),
        y: stage.y(),
      },
    };

    if (pointer) {
      const pointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      zoomInfo.position = {
        x: pointer.x - pointTo.x * clampedScale,
        y: pointer.y - pointTo.y * clampedScale,
      };
    }

    return zoomInfo;
  };

  return (
    <div className="flex">
      <KonvaStage
        ref={stageRef}
        width={width}
        height={height}
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

          if (currentScale > 2)
            modifyCache(
              {
                x: newX,
                y: newY,
                scaleX: currentScale,
                scaleY: currentScale,
              },
              true,
            );

          return { x: newX, y: newY };
        }}
        className="flex-1"
      >
        <Layer>{shapes}</Layer>
      </KonvaStage>
      <div className="flex-[462px] flex-col items-start border-l border-border">
        <h1 className="border-b p-4">Seatmap builder</h1>
        <div>
          {sectionsRef.current?.map((c, idx) => (
            <button
              key={idx}
              className="w-full"
              onClick={() => {
                const node = stageRef.current?.findOne(
                  (cc: Konva.Shape) =>
                    cc.attrs['data-testid'] === c.attrs['data-testid'],
                );
                if (node) node.remove();
              }}
            >
              {c.id()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
