'use client';

import { memo } from 'react';
import { Rect } from 'react-konva';

import { TypedNode } from '../../../types';
import { getNodeAttributes, isInteractive } from './helper';
import { useNodeAttributes } from './use-node-attributes';

function ReactiveRectNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  const reactiveAttrs = useNodeAttributes({ node, improvePerformance });
  return <Rect {...reactiveAttrs} />;
}

function RectNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  const attrs = getNodeAttributes(node, improvePerformance);

  if (isInteractive(node))
    return (
      <ReactiveRectNode node={node} improvePerformance={improvePerformance} />
    );
  return <Rect {...attrs} listening={!improvePerformance} />;
}

const MemoizedRectNode = memo(RectNode);

export default MemoizedRectNode;
