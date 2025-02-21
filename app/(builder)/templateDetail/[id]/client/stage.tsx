'use client';

import { JSX, Ref, useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Konva from 'konva';

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
  const minimapHeight = minimapWidth * mainStageRatio;
  const viewBoxDiff = [
    (viewBox[0] * 100) / width / 100,
    (viewBox[1] * 100) / height / 100,
  ];
  const minimapShrinkSize = width / minimapWidth;

  console.log({ viewBoxDiff });
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
    const {
      scale: newScale,
      position: newPosition,
      miniMapSize,
    } = getZoomInfo({
      deltaY: e.evt.deltaY,
      stage,
      pointer,
      shrinkSize: minimapShrinkSize,
    });

    stage.scale(newScale);
    stage.setPosition(newPosition);

    const miniStage = indicatorRef.current;
    const indicator = getMinimapIndicator();

    if (indicator && miniStage && miniMapSize) {
      const indicatorSize = scaleToIndicatorSize(miniMapSize.scale);

      const isIndicatorFull =
        minimapWidth <= indicatorSize.width &&
        minimapHeight <= indicatorSize.height;

      indicator.width(indicatorSize.width);
      indicator.height(indicatorSize.height);
      indicator.setPosition({
        x: miniMapSize.position.x / (stage.width() / indicatorSize.width),
        y: miniMapSize.position.y / (stage.height() / indicatorSize.height),
      });
      indicator.draggable(!isIndicatorFull);
    }
  };

  const getZoomInfo = ({
    deltaY,
    stage,
    pointer,
    shrinkSize = 1,
  }: {
    deltaY: number;
    stage: Konva.Stage;
    pointer?: Konva.Vector2d | null;
    shrinkSize?: number;
  }): {
    scale: Konva.Vector2d;
    position: Konva.Vector2d;
    miniMapSize?: { scale: Konva.Vector2d; position: Konva.Vector2d };
  } => {
    const isMiniMap = shrinkSize !== 1;
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

    if (isMiniMap) {
      return {
        miniMapSize: {
          ...zoomInfo,
          position: {
            x: -zoomInfo.position.x,
            y: -zoomInfo.position.y,
          },
        },
        ...zoomInfo,
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
