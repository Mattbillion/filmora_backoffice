'use client';

import { memo } from 'react';
import { Text } from 'react-konva';

import { TypedNode } from '../../../types';
import { baseAttrs } from './helper';

function TextNode({ node }: { node: TypedNode }) {
  let fonts = ['Ubuntu', 'Roboto', 'Arial', 'sans-serif'];
  if (!isNaN(node.attrs.text)) fonts.unshift('Space Grotesk');

  return (
    <Text
      {...Object.assign(node.attrs, baseAttrs)}
      fontFamily={fonts.join(',')}
    />
  );
}

const MemoizedTextNode = memo(TextNode);

export default MemoizedTextNode;
