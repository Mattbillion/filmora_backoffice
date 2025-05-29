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

export default function KonvaStagePreview({ json }: KonvaPreviewProps) {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);

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

  // Mouse wheel zoom
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const scaleBy = 1.05;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const direction = e.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
      setScale(newScale);
    };

    stage.container().addEventListener('wheel', handleWheel);
    return () => {
      stage.container().removeEventListener('wheel', handleWheel);
    };
  }, []);

  const konvaOptimization = {
    imageSmoothingEnabled: false,
    listening: false,
    shadowForStrokeEnabled: false,
    perfectDrawEnabled: false,
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
            scale={{ x: scale, y: scale }}
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

  return (
    <div className="flex flex-col gap-2">
      <div
        id="arena-stage-preview"
        ref={stageContainerRef}
        className="relative flex h-[600px] w-full max-w-full items-center justify-center overflow-auto rounded-md border bg-gray-100"
      >
        {renderNode(json.stage)}

        <div className="absolute right-2 top-2 z-10 flex flex-col items-center justify-center gap-2">
          <Button
            onClick={() => setScale((s) => Math.min(5, s * 1.1))}
            size="icon"
          >
            <ZoomIn />
          </Button>
          <Button
            onClick={() => setScale((s) => Math.max(0.2, s / 1.1))}
            size="icon"
          >
            <ZoomOut />
          </Button>
        </div>
      </div>
    </div>
  );
}
