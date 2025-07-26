'use client';

import { memo } from 'react';
import { Line } from 'react-konva';

import { TypedNode } from '../../../types';
import { baseAttrs } from './helper';

function LineNode({ node }: { node: TypedNode }) {
  const attrs = { ...Object.assign(node.attrs, baseAttrs) };
  return <Line {...attrs} />;
}

const MemoizedLineNode = memo(LineNode);

export default MemoizedLineNode;
