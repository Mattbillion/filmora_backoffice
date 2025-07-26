'use client';

import { memo } from 'react';

import type { TypedNode } from '../../types';
import Circle from './nodes/circle';
import Group from './nodes/group';
import ImageNode from './nodes/image';
import Layer from './nodes/layer';
import Line from './nodes/line';
import Path from './nodes/path';
import Rect from './nodes/rect';
import Text from './nodes/text';

function RenderNode({
  node,
  improvePerformance,
}: {
  node: TypedNode;
  improvePerformance?: boolean;
}) {
  switch (node.className) {
    case 'Group':
      return (
        <Group node={node}>
          {node.children?.map((child, idx) => (
            <MemoizedRenderNode
              key={idx}
              node={child}
              improvePerformance={improvePerformance}
            />
          ))}
        </Group>
      );
    case 'Layer':
      return (
        <Layer node={node} improvePerformance={improvePerformance}>
          {node.children?.map((child, idx) => (
            <MemoizedRenderNode
              key={idx}
              node={child}
              improvePerformance={improvePerformance}
            />
          ))}
        </Layer>
      );
    case 'Rect':
      return <Rect node={node} improvePerformance={improvePerformance} />;
    case 'Circle':
      return <Circle node={node} improvePerformance={improvePerformance} />;
    case 'Line':
      return <Line node={node} />;
    case 'Text':
      return <Text node={node} />;
    case 'Path':
      return <Path node={node} improvePerformance={improvePerformance} />;
    case 'Image':
      return <ImageNode node={node} />;
    default:
      return null;
  }
}

const MemoizedRenderNode = memo(RenderNode);

export default MemoizedRenderNode;
