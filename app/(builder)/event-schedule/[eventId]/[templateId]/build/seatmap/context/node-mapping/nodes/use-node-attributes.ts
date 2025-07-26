import { useMemo } from 'react';

import { idRegex } from '../../../constants';
import type { TypedNode } from '../../../types';

interface UseSeatNodePropsOptions {
  node: TypedNode;
  improvePerformance?: boolean;
}

import { baseAttrs } from './helper';

export function useNodeAttributes({
  node,
  improvePerformance = false,
}: UseSeatNodePropsOptions) {
  const isInteractive = idRegex.test(node.id());
  const isSelectable = !improvePerformance && isInteractive;

  const commonProps = useMemo(
    () => ({
      ...node.attrs,
      ...baseAttrs,
      listening: isSelectable,
      hitGraphEnabled: isSelectable,
    }),
    [node.attrs, isSelectable],
  );

  return commonProps;
}
