import { useMemo } from 'react';

import { idRegex } from '../../../constants';
import type { TypedNode } from '../../../types';

interface UseSeatNodePropsOptions {
  node: TypedNode;
  improvePerformance?: boolean;
}

import { usePurchasableUpdate } from '../../purchasable-context';
import { baseAttrs } from './helper';

export function useNodeAttributes({
  node,
  improvePerformance = false,
}: UseSeatNodePropsOptions) {
  const { updatedPurchasable } = usePurchasableUpdate();
  const isInteractive = idRegex.test(node.attrs.id);
  const isPurchasable =
    typeof updatedPurchasable[node.attrs.id] === 'boolean'
      ? updatedPurchasable[node.attrs.id]
      : !!node.attrs['data-purchasable'];
  const isSeat = ['seat', 'table'].includes(node.attrs['data-type']);
  const isSelectable = !improvePerformance && isInteractive;

  const fill = isSeat
    ? isPurchasable
      ? node.attrs.fill
      : '#E0E0E0'
    : node.attrs.fill;

  const commonProps = useMemo(
    () => ({
      ...node.attrs,
      ...baseAttrs,
      fill,
      listening: isSelectable,
      hitGraphEnabled: isSelectable,
    }),
    [node.attrs, isSelectable, fill],
  );

  return commonProps;
}
