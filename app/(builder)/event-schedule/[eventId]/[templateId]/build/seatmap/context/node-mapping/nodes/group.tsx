'use client';

import { memo, ReactNode } from 'react';
import { Group } from 'react-konva';

import { TypedNode } from '../../../types';
import { baseAttrs } from './helper';

function GroupNode({
  children,
  node,
}: {
  children: ReactNode;
  node: TypedNode;
}) {
  const attrs = { ...Object.assign(node.attrs, baseAttrs) };

  delete attrs.onClick;
  delete attrs.hitGraphEnabled;

  return (
    <Group {...attrs} listening={!node.attrs.id?.includes('bg')}>
      {children}
    </Group>
  );
}

const MemoizedGroupNode = memo(GroupNode);

export default MemoizedGroupNode;
