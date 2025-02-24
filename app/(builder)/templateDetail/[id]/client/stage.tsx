'use client';

import { JSX, Ref, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Konva from 'konva';
import { debounce } from 'lodash';

export default function XooxStage({
  height,
  width,
  limitX,
  limitY,
  shapes,
  centerCoord,
  scale,
  viewBox,
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
  const [previewSrc, setPreviewSrc] = useState('');
  const stageRef = useRef<Konva.Stage | null>(null);
  const indicatorRef = useRef<Konva.Stage | null>(null);
  const mainStageRatio = height / width;
  const minimapWidth = 200;
  const minimapHeight = minimapWidth * mainStageRatio; // !!!
  const viewBoxDiff = [
    (viewBox[0] * 100) / width / 100,
    (viewBox[1] * 100) / height / 100,
  ]; // by percent, 0.96 === 96%
  const minimapShrinkSize = width / minimapWidth; // !!!

  useEffect(() => {
    if (stageRef.current) setTimeout(updatePreviewSrc, 300);
  }, []);

  const updatePreviewSrc = () =>
    setPreviewSrc(
      stageRef.current?.toDataURL({
        pixelRatio: 0.5,
        mimeType: 'image/jpeg',
        quality: 0.8,
      }) || '',
    );

  const getMinimapIndicator = () => indicatorRef.current?.find('.indicator')[0];

  const scaleToIndicatorSize = (
    curScale: { x: number; y: number } = scale,
  ) => ({
    width: (minimapWidth * viewBoxDiff[0]) / curScale.x,
    height: minimapHeight / curScale.y,
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

    const miniStage = indicatorRef.current;
    const indicator = getMinimapIndicator();

    if (newScale.x > 2 || newScale.y > 2)
      modifyCache({ ...newPosition, scaleX: newScale.x, scaleY: newScale.y });
    else forceCache();

    if (indicator && miniStage) {
      const indicatorSize = scaleToIndicatorSize(newScale);

      const isIndicatorFull =
        minimapWidth <= indicatorSize.width &&
        minimapHeight <= indicatorSize.height;

      indicator.width(indicatorSize.width);
      indicator.height(indicatorSize.height);
      indicator.setPosition({
        x: newPosition.x / (stage.width() / indicatorSize.width),
        y: newPosition.y / (stage.height() / indicatorSize.height),
      });
      indicator.draggable(!isIndicatorFull);
    }
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

          const getVisibility = () => {
            const nodeBox = node.getClientRect();
            const highRatio =
              nodeBox.width / nodeBox.height > 5 ||
              nodeBox.height / nodeBox.width > 5;

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
              visibleWidth > 0 &&
              visibleHeight > 0 &&
              (isFullyVisible || isPartVisible)
            );
          };

          if (node.isCached()) {
            if (getVisibility()) node.clearCache();
          } else if (forceCache) {
            if (!getVisibility())
              node.cache({
                imageSmoothingEnabled: false,
                hitCanvasPixelRatio: 0.7,
                // drawBorder: true,
              });
          }
        }
      }
    },
    200,
  );

  const forceCache = debounce(() => {
    const visibleNodes = stageRef.current?.find((node: Konva.Shape) => {
      const isGroup = node.name() === 'cachedGroup';

      return isGroup && !node.isCached();
    });
    const nodesLength = visibleNodes?.length;

    if (nodesLength) {
      for (let i = 0; i < nodesLength; i++) {
        visibleNodes[i].cache({
          imageSmoothingEnabled: false,
          hitCanvasPixelRatio: 0.7,
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
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    console.log(*/}
      {/*      'path',*/}
      {/*      stageRef.current?.find('Line')[0]?.setAttrs({ fill: 'red' }),*/}
      {/*    );*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Paint first Line element to red*/}
      {/*</button>*/}
      <Stage
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
      >
        <Layer>{shapes}</Layer>
      </Stage>
      <Minimap
        ref={indicatorRef}
        width={minimapWidth}
        height={minimapHeight}
        centerCoord={{
          x: -centerCoord.x / minimapShrinkSize,
          y: -centerCoord.y / minimapShrinkSize,
        }}
        indicatorSize={scaleToIndicatorSize()}
        previewSrc={previewSrc}
      />
    </>
  );
}

const Minimap = ({
  ref,
  previewSrc,
  width,
  height,
  indicatorSize,
  centerCoord,
}: {
  ref: Ref<Konva.Stage> | null;
  previewSrc: string;
  height: number;
  width: number;
  indicatorSize: { width: number; height: number };
  centerCoord: Konva.Vector2d;
}) => {
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newPos = e.target.position();
    console.log({ newPos });
    // const rawX = newPos.x / minimapScaleX;
    // const rawY = newPos.y / minimapScaleY;

    // onViewportChange({
    //   x: -rawX * mainStageScale + stageWidth / 2,
    //   y: -rawY * mainStageScale + stageHeight / 2,
    // });
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        top: 20,
        boxShadow: '0 0 0 2px #333',
        borderRadius: 8,
        backgroundColor: 'var(--background)',
        backgroundImage: `url(${previewSrc})`,
        backgroundSize: `100%`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <Stage ref={ref} width={width} height={height}>
        <Layer>
          <Rect
            name="indicator"
            x={centerCoord.x}
            y={centerCoord.y}
            width={indicatorSize.width}
            height={indicatorSize.height}
            fill="rgba(51, 153, 255, 0.2)"
            stroke="rgba(51, 153, 255, 0.7)"
            strokeWidth={0.5}
            onDragMove={handleDragMove}
            onDragEnd={handleDragMove}
            cornerRadius={4}
            onMouseDown={(e) => (e.cancelBubble = true)}
            onTouchStart={(e) => (e.cancelBubble = true)}
          />
        </Layer>
      </Stage>
    </div>
  );
};
