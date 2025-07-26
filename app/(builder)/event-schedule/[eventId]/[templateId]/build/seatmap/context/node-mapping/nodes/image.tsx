'use client';

import { memo } from 'react';
import { Image as KImage } from 'react-konva';

import { TypedNode } from '../../../types';
import { baseAttrs } from './helper';

function ImageNode({ node }: { node: TypedNode }) {
  return (
    <KImage
      image={node.attrs.image}
      {...Object.assign(node.attrs, baseAttrs)}
    />
  );
}

const MemoizedImageNode = memo(ImageNode);

export default MemoizedImageNode;
