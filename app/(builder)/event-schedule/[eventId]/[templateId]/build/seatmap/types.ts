import { dataMap } from './constants';

export type {
  Layer as KLayer,
  LayerConfig as KLayerConf,
} from 'konva/lib/Layer';
import type { Node as KNode } from 'konva/lib/Node';
export type {
  Group as KGroup,
  GroupConfig as KGroupConf,
} from 'konva/lib/Group';
export type {
  KonvaEventListener as KEventListener,
  KonvaEventObject as KEventObject,
  Node as KNode,
  NodeConfig as KNodeConf,
} from 'konva/lib/Node';
export type { Text as KText } from 'konva/lib/shapes/Text';
export type {
  Stage as KStage,
  StageConfig as KStageConf,
} from 'konva/lib/Stage';
export type { Vector2d } from 'konva/lib/types';

export type DataMapEnum = {
  [K in keyof typeof dataMap]: (typeof dataMap)[K];
}[keyof typeof dataMap];

export type DataAttrs = {
  [K in DataMapEnum as `data-${K}`]?: string;
};

export interface CustomAttrs extends DataAttrs {
  'data-type'?: DataMapEnum;
  'data-purchasable'?: boolean;
  'data-seat-id'?: number;
}

export type TypedNode<T extends CustomAttrs = CustomAttrs> = KNode & {
  attrs: T;
  children?: TypedNode[];
  className: string;
};
