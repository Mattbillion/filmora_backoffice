import type { TypedNode } from '../../../types';

export const isInteractive = (node: TypedNode) => {
  return (
    node.className !== 'Text' &&
    typeof node.attrs['data-purchasable'] === 'boolean' &&
    !!(node.attrs['data-seat'] || node.attrs['data-table'])
  );
};

export const baseAttrs = {
  perfectDrawEnabled: false,
  strokeScaleEnabled: false,
  shadowEnabled: false,
  shadowForStrokeEnabled: false,
  hitStrokeWidth: 0,
  listening: false,
  hitGraphEnabled: false,
  onClick: undefined,
};

export const getNodeAttributes = (
  node: TypedNode,
  improvePerformance: boolean = true,
) => {
  const attrs = { ...Object.assign(node.attrs, baseAttrs) };

  if (!improvePerformance) {
    delete attrs.onClick;
    delete attrs.hitGraphEnabled;
  }

  return attrs;
};
