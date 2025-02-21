'use client';

import { JSX, useEffect, useRef, useState } from 'react';
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
}: {
  height: number;
  width: number;
  limitX: number;
  limitY: number;
  shapes: JSX.Element[];
  centerCoord: { x: number; y: number };
  scale: { x: number; y: number };
}) {
  const [previewSrc, setPreviewSrc] = useState('');
  const stageRef = useRef<Konva.Stage | null>(null);
  const indicatorRef = useRef<Konva.Stage | null>(null);
  const mainStageRatio = height / width;
  const minimapWidth = 200;
  const minimapHeight = minimapWidth * mainStageRatio;
  const minimapShrinkSize = width / minimapWidth;

  useEffect(() => {
    if (stageRef.current) setTimeout(updatePreviewSrc, 300);
  }, []);

  const updatePreviewSrc = () =>
    setPreviewSrc(
      stageRef.current?.toDataURL({
        pixelRatio: 0.5,
      }) || '',
    );

  const getMinimapIndicator = () => indicatorRef.current?.find('.indicator')[0];

  const scaleToIndicatorSize = (
    curScale: { x: number; y: number } = scale,
  ) => ({
    width: Math.min(minimapWidth, minimapWidth / curScale.x),
    height: Math.min(minimapHeight, minimapHeight / curScale.y),
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

      indicator.width(indicatorSize.width);
      indicator.height(indicatorSize.height);
      indicator.setPosition(miniMapSize.position);
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
    const resizeNum = (num: number) => num / shrinkSize;
    const isMiniMap = shrinkSize !== 1;
    const scaleBy = 1.05;
    const maxScale = 10;
    const minScale = isMiniMap ? 1 : 0.5;
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
        x: (pointer.x - pointTo.x * clampedScale) * (isMiniMap ? -1 : 1),
        y: (pointer.y - pointTo.y * clampedScale) * (isMiniMap ? -1 : 1),
      };
    }

    if (!isMiniMap) return zoomInfo;
    return {
      miniMapSize: zoomInfo,
      ...getZoomInfo({ deltaY, stage, pointer }),
    };
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
      <Minimap
        ref={indicatorRef}
        width={minimapWidth}
        height={minimapHeight}
        indicatorSize={scaleToIndicatorSize()}
        previewSrc={previewSrc}
      />
    </>
  );
}

const Minimap = ({ ref, previewSrc, width, height, indicatorSize }) => {
  const handleDragMove = (e) => {
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
        border: '2px solid #333',
        borderRadius: 8,
        backgroundColor: 'white',
        backgroundImage: `url(${previewSrc})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Stage ref={ref} width={width} height={height}>
        <Layer>
          <Rect
            name="indicator"
            x={0}
            y={0}
            width={indicatorSize.width}
            height={indicatorSize.height}
            fill="rgba(255,0,0,0.2)"
            stroke="rgba(255,0,0,0.5)"
            strokeWidth={0.5}
            draggable
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
