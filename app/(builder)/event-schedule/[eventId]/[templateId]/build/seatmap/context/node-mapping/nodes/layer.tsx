'use client';

import { memo, ReactNode } from 'react';
import { Layer } from 'react-konva';

import { TypedNode } from '../../../types';

function LayerNode({
  children,
  node,
  improvePerformance,
}: {
  children: ReactNode;
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  return (
    <Layer {...node.attrs} listening={!improvePerformance}>
      {children}
    </Layer>
  );
}

const MemoizedLayerNode = memo(LayerNode);

export default MemoizedLayerNode;
