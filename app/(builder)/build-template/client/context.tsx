'use client';

import React, {
  createContext,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Layer, Stage as KonvaStage } from 'react-konva';
import type Konva from 'konva';

import { KonvaNode } from '../schema';
import { dataMap } from './constants';

type KonvaStageContextType = {
  getStage: () => Konva.Stage;
  stageChilds: KonvaNode[];
  focusNode: (node: KonvaNode) => void;
  baseLayer: Konva.Layer;
  forceUpdate: () => void;
  initialValues: {
    width: number;
    height: number;
    x: number;
    y: number;
    scale: {
      x: number;
      y: number;
    };
  };
};

const scaleBy = 1.05;
const maxScale = 10;
const minScale = 0.5;

const KonvaStageContext = createContext<KonvaStageContextType | undefined>(
  undefined,
);

export const KonvaStageProvider = ({
  height,
  width,
  limitX,
  limitY,
  shapes,
  centerCoord,
  scale,
  children,
}: {
  height: number;
  width: number;
  limitX: number;
  limitY: number;
  shapes: JSX.Element[];
  centerCoord: { x: number; y: number };
  scale: { x: number; y: number };
  children: ReactNode;
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate(1);
  }, [shapes]);

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
  };

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

  const [baseLayer, selectedShapesLayer] = stageRef.current?.getLayers() || [];

  const stageChilds = (baseLayer?.children?.filter(
    (c) => c.getType() === 'Group',
  ) || []) as unknown as KonvaNode[];

  const focusNode = (n: KonvaNode) => {
    const selectedNodes = [
      baseLayer.findOne((c: KonvaNode) => c._id === n._id),
    ];
    const emptyLayer = selectedShapesLayer.destroyChildren();
    if ([dataMap.r, dataMap.t, dataMap.s].includes(n.attrs['data-type'])) {
      const parent = n.getParent();
      const selectedBox = n.getClientRect({ relativeTo: baseLayer });

      const candidates = parent?.find('Text') as Konva.Text[];

      for (const textNode of candidates) {
        const textBox = textNode.getClientRect({ relativeTo: baseLayer });

        const intersects =
          selectedBox.x < textBox.x + textBox.width &&
          selectedBox.x + selectedBox.width > textBox.x &&
          selectedBox.y < textBox.y + textBox.height &&
          selectedBox.y + selectedBox.height > textBox.y;

        if (intersects) {
          selectedNodes.push(textNode);
        }
      }
    }

    for (let i = 0; i < selectedNodes.length; i++) {
      const clonedNode = selectedNodes[i]?.clone();
      clonedNode.setAttr('opacity', 1);
      emptyLayer.add(clonedNode);
    }

    emptyLayer.batchDraw();
  };

  return (
    <KonvaStageContext.Provider
      value={{
        getStage: () => stageRef.current!,
        stageChilds,
        focusNode,
        baseLayer,
        forceUpdate: () => forceUpdate((c) => c + 1),
        initialValues: {
          width,
          height,
          x: centerCoord.x,
          y: centerCoord.y,
          scale,
        },
      }}
    >
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
            const newX = Math.max(
              -scaledLimit.x,
              Math.min(pos.x, scaledLimit.x),
            );
            const newY = Math.max(
              -scaledLimit.y,
              Math.min(pos.y, scaledLimit.y),
            );

            return { x: newX, y: newY };
          }}
          className="flex-1"
        >
          <Layer
            name="base"
            imageSmoothingEnabled={false}
            listening={false}
            shadowForStrokeEnabled={false}
            perfectDrawEnabled={false}
          >
            {shapes}
          </Layer>
          <Layer
            name="selected-shapes"
            imageSmoothingEnabled={false}
            listening={false}
            shadowForStrokeEnabled={false}
            perfectDrawEnabled={false}
          />
        </KonvaStage>
        <div className="flex h-[calc(100dvh-64px)] flex-[462px] flex-col border-l border-border">
          {children}
        </div>
      </div>
    </KonvaStageContext.Provider>
  );
};

export const useKonvaStage = () => {
  const context = useContext(KonvaStageContext);
  if (!context) {
    throw new Error('useKonvaStage must be used within a KonvaStageProvider');
  }
  return context;
};
