'use client';

import React, {
  ComponentType,
  createContext,
  Fragment,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Layer, Stage as StageCanvas } from 'react-konva';
import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';

import { dataMapReverse, MAX_SCALE, MIN_SCALE, SCALE_BY } from '../constants';
import {
  KEventObject,
  KGroup,
  KLayer,
  KNode,
  KStage,
  KText,
  TypedNode,
  Vector2d,
} from '../types';
import { usePurchasableUpdate } from './purchasable-context';

const RenderTicketNode = dynamic(() => import('./node-mapping'), {
  ssr: false,
});

const StageContext = createContext<
  | {
      getStage: () => KStage;
      getTicketsRef: () => KLayer;
      getStageClientRect: () => {
        width: number;
        height: number;
        x: number;
        y: number;
      };
      seatsLoaded: boolean;
      containPurchasableNode: (node: KNode) => boolean;
      focusNode: (node: KNode) => void;
    }
  | undefined
>(undefined);

const getZoomInfo = ({
  deltaY,
  stage,
  pointer,
  scaleBy = SCALE_BY,
}: {
  deltaY: number;
  scaleBy?: number;
  stage: KStage;
  pointer?: Vector2d | null;
}) => {
  const oldScale = stage.scaleX();
  const newScale = deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
  const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

  if (!pointer) {
    return {
      scale: { x: clampedScale, y: clampedScale },
      position: { x: stage.x(), y: stage.y() },
    };
  }

  const stagePos = stage.position();

  const pointTo = {
    x: (pointer.x - stagePos.x) / oldScale,
    y: (pointer.y - stagePos.y) / oldScale,
  };

  return {
    scale: { x: clampedScale, y: clampedScale },
    position: {
      x: pointer.x - pointTo.x * clampedScale,
      y: pointer.y - pointTo.y * clampedScale,
    },
  };
};

const MemoizedStage = memo(StageCanvas);

const StageProviderComponent = ({
  stageJson,
  ticketsJson,
  children,
  addonBefore,
  addonAfter,
  stageContainerWrapper: StageContainerWrapper = Fragment,
  containerClassName,
}: {
  stageJson: TypedNode;
  ticketsJson: TypedNode;
  children: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  stageContainerWrapper?: ComponentType<{ children: ReactNode }>;
  containerClassName?: string;
}) => {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KStage>(null);
  const ticketsRef = useRef<KLayer>(null);
  const seatIncludedGroupsRef = useRef<string[]>(null);
  const { forceUpdate } = usePurchasableUpdate();

  const stageClientRectRef = useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [seatsLoaded, setSeatsLoaded] = useState(false);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!!ticketsJson && dimensions.width > 0 && dimensions.height > 0) {
      timeout = setTimeout(() => {
        forceUpdate();
        setSeatsLoaded(true);
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [ticketsJson, dimensions]);

  useEffect(() => {
    if (seatsLoaded) {
      startTransition(() => {
        ticketsRef.current?.find((node: KText) => {
          if (node.className === 'Text') {
            const allSold =
              (node.getParent() as KGroup).find(
                (childNode: KNode) => !!childNode.attrs['data-purchasable'],
              ).length === 0;

            if (allSold) node.destroy();
          }
        });
      });
    }
  }, [seatsLoaded]);

  const handleWheel = (e: KEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    e.evt.preventDefault();

    const { scale: newScale, position: newPosition } = getZoomInfo({
      deltaY: e.evt.deltaY,
      stage,
      pointer: stage.getPointerPosition(),
    });

    stage.scale(newScale);
    stage.position(newPosition);
  };

  const canRender = dimensions.width > 0 && dimensions.height > 0;

  const containPurchasableNode = (node: KNode) => {
    const nodeType = node.attrs['data-type'] as string;
    const typeValue = node.attrs[`data-${nodeType}`] as string;
    const typeId = dataMapReverse[nodeType] + typeValue;

    if (seatIncludedGroupsRef.current)
      return seatIncludedGroupsRef.current.includes(typeId);

    const purchasables =
      ticketsRef.current
        ?.find((c: KNode) => c.attrs['data-purchasable'])
        .map((c) =>
          c
            .id()
            .split('-')
            .filter((cc) => !!cc && !/^[stU]/g.test(cc)),
        )
        .reduce((acc, cur) => {
          const arr = acc;
          cur.map((c) => (!arr.includes(c) ? arr.push(c) : false));

          return arr;
        }, []) || [];

    seatIncludedGroupsRef.current = purchasables;
    return purchasables.includes(typeId);
  };

  const focusNode = (node: KNode) => {
    const ticketsLayer = stageRef.current?.findOne('.tickets') as KLayer;
    const clonedNode = node.clone();
    const selectedShapesLayer = stageRef.current?.findOne(
      '.selected-shapes',
    ) as KLayer;

    ticketsLayer.cache();
    ticketsLayer.setAttr('opacity', 0.3);
    const emptyLayer = selectedShapesLayer.destroyChildren();
    clonedNode.setAttr('opacity', 1);
    emptyLayer.add(clonedNode);
    emptyLayer.batchDraw();
  };

  const stageChildren = useMemo(
    () =>
      stageJson.children?.map((child, idx) => (
        <RenderTicketNode key={idx} node={child} improvePerformance />
      )),
    [stageJson.children],
  );

  const ticketChildren = useMemo(
    () =>
      ticketsJson.children?.map((node, idx) => (
        <RenderTicketNode
          key={`ticket-${idx}`}
          node={node}
          improvePerformance
        />
      )),
    [ticketsJson.children],
  );

  return (
    <StageContext.Provider
      value={{
        getStage: () => stageRef.current!,
        getTicketsRef: () =>
          ticketsRef.current! || stageRef.current!.findOne('.tickets'),
        getStageClientRect: () => stageClientRectRef.current!,
        seatsLoaded,
        containPurchasableNode,
        focusNode,
      }}
    >
      <StageContainerWrapper>
        <div
          className={cn('touch-none select-none', containerClassName)}
          ref={(ref) => {
            if (ref && !stageContainerRef.current) {
              stageContainerRef.current = ref;
              const { clientWidth, clientHeight } = ref;
              setDimensions({ width: clientWidth, height: clientHeight });
            }
          }}
        >
          {canRender && (
            <>
              {addonBefore}
              <MemoizedStage
                ref={(ref) => {
                  if (ref) {
                    stageRef.current = ref;
                    const refRect = ref.getStage().getClientRect();

                    if (!stageClientRectRef.current && refRect.width > 0)
                      stageClientRectRef.current = refRect;
                  }
                }}
                width={dimensions.width}
                height={dimensions.height}
                onWheel={handleWheel}
                draggable
              >
                {stageChildren}
                <Layer ref={ticketsRef} name="tickets">
                  {ticketChildren}
                </Layer>
                <Layer
                  name="selected-shapes"
                  imageSmoothingEnabled={false}
                  listening={false}
                  shadowForStrokeEnabled={false}
                  perfectDrawEnabled={false}
                />
              </MemoizedStage>
              {addonAfter}
            </>
          )}
        </div>
      </StageContainerWrapper>
      {children}
    </StageContext.Provider>
  );
};

const StageProvider = memo(StageProviderComponent);

export default StageProvider;

export const useStage = () => {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error('useStage must be used within a StageProvider');
  }
  return context;
};
