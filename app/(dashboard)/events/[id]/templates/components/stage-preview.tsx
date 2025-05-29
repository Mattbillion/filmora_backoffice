'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Arrow,
  Circle,
  Ellipse,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Path,
  Rect,
  RegularPolygon,
  Ring,
  Stage,
  Star,
  Text,
  Wedge,
} from 'react-konva';
import Konva from 'konva';
import { ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface KonvaPreviewProps {
  json: {
    stage: any;
    tickets: any;
  };
}

const scaleBy = 1.05;
const maxScale = 10;
const minScale = 0.1;

export default function KonvaStagePreview({ json }: KonvaPreviewProps) {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  // Resize container
  useEffect(() => {
    const container = document.getElementById('arena-stage-preview');
    if (!container) return;

    const updateSize = () => {
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Add ticket group
  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const layers = stage.getLayers();
    const firstLayer = layers[0];

    if (firstLayer && json.tickets) {
      const group = new Konva.Group(json.tickets.attrs);

      (json.tickets.children || []).forEach((node: any) => {
        const shape = Konva.Node.create(node);
        group.add(shape);
      });

      firstLayer.add(group);
      firstLayer.draw();
    }
  }, [json.tickets]);

  const konvaOptimization = {
    imageSmoothingEnabled: false,
    listening: false,
    shadowForStrokeEnabled: false,
    perfectDrawEnabled: false,
  };

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

  const renderNode = (node: any): ReactNode | null => {
    const { className, children, _id } = node;
    const attrs = { ...node.attrs, ...konvaOptimization };

    switch (className) {
      case 'Stage':
        return (
          <Stage
            {...attrs}
            key={_id}
            ref={stageRef}
            width={size.width}
            height={size.height}
            onWheel={handleWheel}
            className="bg-white"
          >
            {(children || []).map(renderNode)}
          </Stage>
        );
      case 'Layer':
        return (
          <Layer key={_id} {...attrs}>
            {(children || []).map(renderNode)}
          </Layer>
        );
      case 'Group':
        return (
          <Group key={_id} {...attrs}>
            {(children || []).map(renderNode)}
          </Group>
        );
      case 'Rect':
        return <Rect key={_id} {...attrs} />;
      case 'Text':
        return <Text key={_id} {...attrs} />;
      case 'Circle':
        return <Circle key={_id} {...attrs} />;
      case 'Line':
        return <Line key={_id} {...attrs} />;
      case 'Ellipse':
        return <Ellipse key={_id} {...attrs} />;
      case 'Star':
        return <Star key={_id} {...attrs} />;
      case 'RegularPolygon':
        return <RegularPolygon key={_id} {...attrs} />;
      case 'Ring':
        return <Ring key={_id} {...attrs} />;
      case 'Wedge':
        return <Wedge key={_id} {...attrs} />;
      case 'Arrow':
        return <Arrow key={_id} {...attrs} />;
      case 'Path':
        return <Path key={_id} {...attrs} />;
      case 'Image':
        return <KonvaImage key={_id} {...attrs} />;
      default:
        return null;
    }
  };

  function zoomStage(sclB: number) {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const stagePos = stage.position();
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newScale = oldScale * sclB;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        id="arena-stage-preview"
        ref={stageContainerRef}
        className="relative flex h-[600px] w-full max-w-full items-center justify-center overflow-auto rounded-md border bg-gray-100"
      >
        {renderNode(json.stage)}

        <div className="absolute right-2 top-2 z-10 flex flex-col items-center justify-center gap-2">
          <Button onClick={() => zoomStage(1.2)} size="icon">
            <ZoomIn />
          </Button>

          <Button onClick={() => zoomStage(1 / 1.2)} size="icon">
            <ZoomOut />
          </Button>
        </div>
      </div>
    </div>
  );
}
