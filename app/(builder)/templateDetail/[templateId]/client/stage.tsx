'use client';

import { JSX, useEffect, useRef } from 'react';
import { Group, Layer, Rect, Stage as KonvaStage } from 'react-konva';
import Konva from 'konva';
import { debounce } from 'lodash';

import { Button } from '@/components/ui/button';

import { Floor } from './floor';
import { Section } from './section';
import { Sector } from './sector';

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
  // const [masks, setMasks] = useState<
  //   {
  //     x: number;
  //     y: number;
  //     width: number;
  //     height: number;
  //     id: string;
  //     fill?: string;
  //   }[]
  // >([]);

  useEffect(() => {
    if (stageRef.current) {
      sectionsRef.current = stageRef.current.find('.ticketSection');
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

  const groupByFirstPart = () => {
    const result: Record<string, Record<string, Konva.Node[]>> = {};

    for (let i = 0; i < sectionsRef.current.length; i++) {
      const node = sectionsRef.current[i];

      const [firstPart, secondPart] = node.id().replace(/_/g, '-').split('-');

      if (!result[firstPart]) result[firstPart] = {};

      if (secondPart) {
        if (!result[firstPart][secondPart]) result[firstPart][secondPart] = [];
        result[firstPart][secondPart].push(node);
      } else {
        if (!result[firstPart]['Zone']) result[firstPart]['Zone'] = [];
        result[firstPart]['Zone'].push(node);
      }
    }

    return result;
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
        <Layer>
          {shapes}
          <Group id="mask">
            {/*{masks.map((mask, idx) => (*/}
            {/*  <Rect*/}
            {/*    key={idx}*/}
            {/*    id={mask.id}*/}
            {/*    width={mask.width}*/}
            {/*    height={mask.height}*/}
            {/*    x={mask.x}*/}
            {/*    y={mask.y}*/}
            {/*    fill={mask.fill || '#1E3A8A'}*/}
            {/*    cornerRadius={4}*/}
            {/*  />*/}
            {/*))}*/}
          </Group>
          <Rect
            name="el-indicator"
            width={0}
            height={0}
            x={0}
            y={0}
            visible={false}
            fill="rgba(0,210,255,0.49)"
            stroke="#00D2FF"
            strokeWidth={2}
            cornerRadius={2}
          />
        </Layer>
      </KonvaStage>
      <div className="flex h-[calc(100dvh-64px)] flex-[462px] flex-col border-l border-border">
        <h1 className="border-b p-4">Seatmap builder</h1>
        <div className="min-h-0 flex-1">
          <div
            className="max-h-full space-y-4 overflow-y-auto p-4"
            onMouseLeave={() => {
              const elIndicator = stageRef.current?.findOne('.el-indicator');
              elIndicator?.visible(false);
            }}
          >
            {Object.entries(groupByFirstPart())?.map(
              ([label, seatmap], idx) => {
                const stage = stageRef.current;
                if (!stage) return null;

                return (
                  <Floor key={idx} label={label}>
                    {Object.entries(seatmap).map(
                      ([sectionName, section], idx1) => {
                        return (
                          <Section
                            key={idx1}
                            label={label}
                            section={section}
                            sectionName={sectionName}
                            stage={stage}
                          >
                            {section.map((sector, idx2) => (
                              <Sector
                                key={idx2}
                                sector={sector}
                                stage={stage}
                              />
                            ))}
                          </Section>
                        );
                      },
                    )}
                  </Floor>
                );
              },
            )}
          </div>
        </div>
        <Button
          className="m-4"
          onClick={() => {
            console.log(stageRef.current?.toObject());
          }}
        >
          Build
        </Button>
      </div>
    </div>
  );
}
