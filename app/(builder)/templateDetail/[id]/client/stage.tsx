'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage as KonvaStage } from 'react-konva';
import Konva from 'konva';
import { debounce } from 'lodash';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

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
  const [masks, setMasks] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);

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
            {masks.map((mask, idx) => (
              <Rect
                key={idx}
                width={mask.width}
                height={mask.height}
                x={mask.x}
                y={mask.y}
                fill="#00D2FF"
                stroke="black"
                strokeWidth={2}
              />
            ))}
          </Group>
        </Layer>
      </KonvaStage>
      <div className="flex h-[calc(100dvh-64px)] flex-[462px] flex-col border-l border-border">
        <h1 className="border-b p-4">Seatmap builder</h1>
        <div className="min-h-0 flex-1">
          <div className="max-h-full space-y-4 overflow-y-auto p-4">
            {Object.entries(groupByFirstPart())?.map(
              ([label, seatmap], idx) => {
                const stage = stageRef.current;
                if (!stage) return null;

                return (
                  <Accordion type="single" key={idx} collapsible>
                    <AccordionItem
                      value={label}
                      className="rounded-lg border px-4"
                    >
                      <AccordionTrigger>
                        {label.replace(/^F+(\d+)/g, 'Floor: $1')}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 [&>div:last-child>div]:border-b-0">
                        {Object.entries(seatmap).map(
                          ([sectionName, section], idx1) => {
                            return (
                              <Accordion type="multiple" key={idx1}>
                                <AccordionItem
                                  value={label}
                                  className="px-4 [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
                                >
                                  <AccordionTrigger className="pb-4 pt-2">
                                    {sectionName.replace(/^Z+(.)/g, 'Zone: $1')}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    {section.map((sector, idx2) => {
                                      const node = stage.findOne(
                                        (cc: Konva.Shape) =>
                                          cc.attrs['data-testid'] ===
                                          sector.attrs['data-testid'],
                                      );
                                      // @ts-ignore
                                      let sectorName = sector
                                        .id()
                                        .split(/[\s-]+/)
                                        .at(-1)
                                        .replace('_', ' ');

                                      if (/(\S+-S(\d+))$/g.test(sector.id()))
                                        sectorName = sector
                                          .id()
                                          .replace(
                                            /(\S+-S(\d+))$/g,
                                            'Section: $2',
                                          );

                                      return (
                                        <button
                                          key={idx2}
                                          className="w-full"
                                          disabled={!node}
                                          onClick={() => {
                                            if (node) {
                                              const {
                                                x,
                                                y,
                                                width: nodeW,
                                                height: nodeH,
                                              } = node.getClientRect({
                                                relativeTo: stage,
                                              });
                                              setMasks([
                                                ...masks,
                                                {
                                                  x,
                                                  y,
                                                  width: nodeW,
                                                  height: nodeH,
                                                },
                                              ]);
                                            }
                                          }}
                                        >
                                          {sectorName}
                                        </button>
                                      );
                                    })}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          },
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              },
            )}
          </div>
        </div>
        <Button className="m-4">Build</Button>
      </div>
    </div>
  );
}
