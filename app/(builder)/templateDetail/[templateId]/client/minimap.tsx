'use client';

import { Ref } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Konva from 'konva';

export const Minimap = ({
  ref,
  onPositionUpdate,
}: {
  ref: Ref<Konva.Stage> | null;
  onPositionUpdate: (pos: Konva.Vector2d) => void;
}) => {
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const pos = e.target.position();
    const stage = e.target.getStage();

    if (!stage) return;

    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const indicatorWidth = e.target.width() || 40;
    const indicatorHeight = e.target.height() || 40;

    const minX = -(indicatorWidth * 0.7);
    const minY = -(indicatorHeight * 0.7);
    const maxX = stageWidth - indicatorWidth * 0.3;
    const maxY = stageHeight - indicatorHeight * 0.3;

    e.target.position({
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    });

    onPositionUpdate(e.target.position());
  };

  return (
    <Stage
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        boxShadow: '0 0 0 2px #333',
        borderRadius: 8,
        backgroundColor: 'hsl(var(--background))',
        backgroundSize: `100%`,
        backgroundPosition: 'top left',
        overflow: 'hidden',
      }}
      visible={false}
    >
      <Layer>
        <Rect
          name="indicator"
          fill="rgba(51, 153, 255, 0.4)"
          stroke="rgba(51, 153, 255, 0.8)"
          strokeWidth={0.5}
          onDragMove={handleDragMove}
          onDragEnd={handleDragMove}
          draggable
          cornerRadius={4}
          hitStrokeWidth={0}
          shadowForStrokeEnabled={false}
          onMouseDown={(e) => (e.cancelBubble = true)}
          onTouchStart={(e) => (e.cancelBubble = true)}
        />
      </Layer>
    </Stage>
  );
};
