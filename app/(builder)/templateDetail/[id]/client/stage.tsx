'use client';

import { JSX, useRef } from 'react';
import { Layer, Stage as KonvaStage } from 'react-konva';
import Konva from 'konva';
import { debounce } from 'lodash';

// import { Minimap } from './minimap';

export default function Stage({
  height,
  width,
  limitX,
  limitY,
  shapes,
  centerCoord,
  scale,
  // viewBox,
}: {
  height: number;
  width: number;
  limitX: number;
  limitY: number;
  shapes: JSX.Element[];
  centerCoord: { x: number; y: number };
  scale: { x: number; y: number };
  viewBox: [number, number];
}) {
  const stageRef = useRef<Konva.Stage>(null);
  // const minimapRef = useRef<Konva.Stage>(null);
  // const stageRatio = height / width;
  // const minimapWidth = 150;
  // const minimapHeight = minimapWidth * stageRatio;
  // const minimapRelativeWidth = (minimapWidth * 100) / viewBox[0] / 100;
  // const minimapRelativeHeight = (minimapHeight * 100) / viewBox[1] / 100;
  //
  // useEffect(() => {
  //   if (stageRef.current)
  //     setTimeout(() => {
  //       const minimap = minimapRef.current;
  //
  //       if (minimap) {
  //         const indicator = minimapRef.current?.findOne('.indicator');
  //
  //         if (indicator) resetIndicator(indicator);
  //
  //         minimap.visible(true);
  //         minimap.width(minimapWidth);
  //         minimap.height(minimapHeight);
  //         minimap.container().style.setProperty(
  //           'background-image',
  //           `url(${
  //             stageRef.current!.toDataURL({
  //               pixelRatio: 0.5,
  //             }) || ''
  //           })`,
  //         );
  //       }
  //     }, 300);
  // }, []);

  // const getMinimapIndicator = () => minimapRef.current?.findOne('.indicator');

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

    // cache
    if (newScale.x > 2 || newScale.y > 2)
      modifyCache({ ...newPosition, scaleX: newScale.x, scaleY: newScale.y });
    else forceCache();

    // indicator
    // const minimapIndicator = getMinimapIndicator();
    // if (minimapIndicator) {
    //   if (newScale.x < scale.x) return resetIndicator(minimapIndicator);
    //
    //   const indicatorWidth = (viewBox[0] / newScale.x) * minimapRelativeWidth;
    //
    //   minimapIndicator.draggable(true);
    //   minimapIndicator.width(indicatorWidth);
    //   minimapIndicator.height(indicatorWidth * stageRatio);
    //
    //   minimapIndicator.setPosition({
    //     x: (newPosition.x / newScale.x) * -minimapRelativeWidth,
    //     y: (newPosition.y / newScale.y) * -minimapRelativeHeight,
    //   });
    // }
  };

  // const resetIndicator = (indicator: Konva.Node) => {
  //   if (!indicator.draggable()) return;
  //   indicator.width(minimapWidth);
  //   indicator.height(minimapHeight);
  //   indicator.position({ x: 0, y: 0 });
  //   indicator.draggable(false);
  // };

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
        visibleNodes[i].cache({
          // drawBorder: true,
        });
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
    const scaleBy = 1.05;
    const maxScale = 10;
    const minScale = 0.5;
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
    <>
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
          // const minimapIndicator = getMinimapIndicator();
          //
          // if (!minimapIndicator) return { x: newX, y: newY };
          //
          // if (currentScale < scale.x) {
          //   resetIndicator(minimapIndicator);
          // } else {
          //   minimapIndicator.draggable(true);
          //   minimapIndicator.setPosition({
          //     x: (-newX / currentScale) * minimapRelativeWidth,
          //     y: (-newY / currentScale) * minimapRelativeHeight,
          //   });
          // }

          return { x: newX, y: newY };
        }}
      >
        <Layer>{shapes}</Layer>
      </KonvaStage>
      {/*<Minimap*/}
      {/*  ref={minimapRef}*/}
      {/*  onPositionUpdate={(miniPos) => {*/}
      {/*    const currentScale = stageRef.current?.scaleX() || scale.x;*/}

      {/*    const pos = {*/}
      {/*      x: (miniPos.x * currentScale) / -minimapRelativeWidth,*/}
      {/*      y: (miniPos.y * currentScale) / -minimapRelativeHeight,*/}
      {/*    };*/}

      {/*    if (currentScale > 2)*/}
      {/*      modifyCache(*/}
      {/*        {*/}
      {/*          x: pos.x,*/}
      {/*          y: pos.y,*/}
      {/*          scaleX: currentScale,*/}
      {/*          scaleY: currentScale,*/}
      {/*        },*/}
      {/*        true,*/}
      {/*      );*/}
      {/*    stageRef.current?.setPosition(pos);*/}
      {/*  }}*/}
      {/*/>*/}
    </>
  );
}
