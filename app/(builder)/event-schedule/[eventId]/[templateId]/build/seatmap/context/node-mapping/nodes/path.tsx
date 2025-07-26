'use client';

import { memo } from 'react';
import { Path } from 'react-konva';

import { TypedNode } from '../../../types';
import { getNodeAttributes, isInteractive } from './helper';
import { useNodeAttributes } from './use-node-attributes';

function ReactivePathNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  const reactiveAttrs = useNodeAttributes({ node, improvePerformance });
  return <Path {...reactiveAttrs} />;
}

function PathNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  const attrs = getNodeAttributes(node, improvePerformance);

  if (isInteractive(node))
    return (
      <ReactivePathNode node={node} improvePerformance={improvePerformance} />
    );
  return <Path {...attrs} listening={!improvePerformance} />;
}

const MemoizedPathNode = memo(PathNode);

export default MemoizedPathNode;
