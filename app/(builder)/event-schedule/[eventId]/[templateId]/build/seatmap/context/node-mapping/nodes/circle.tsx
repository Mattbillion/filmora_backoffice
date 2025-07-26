'use client';

import { memo } from 'react';
import { Circle } from 'react-konva';

import { TypedNode } from '../../../types';
import { getNodeAttributes, isInteractive } from './helper';
import { useNodeAttributes } from './use-node-attributes';

function ReactiveCircleNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  const reactiveAttrs = useNodeAttributes({ node, improvePerformance });
  return <Circle {...reactiveAttrs} />;
}

function CircleNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  const attrs = getNodeAttributes(node, improvePerformance);

  if (isInteractive(node))
    return (
      <ReactiveCircleNode node={node} improvePerformance={improvePerformance} />
    );
  return <Circle {...attrs} listening={!improvePerformance} />;
}

const MemoizedCircleNode = memo(CircleNode);

export default MemoizedCircleNode;
