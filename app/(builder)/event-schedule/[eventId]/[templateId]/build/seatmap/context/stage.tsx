'use client';

import {
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

import {
  dataMapReverse,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_BY,
  ZOOM_THRESHOLD,
} from '../constants';
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

const RenderTicketNode = dynamic(() => import('./node-mapping'), {
  ssr: false,
});

const StageContext = createContext<
  | {
      getStage: () => KStage;
      getTicketsRef: () => KLayer;
      getMasksRef: () => KLayer;
      getStageClientRect: () => {
        width: number;
        height: number;
        x: number;
        y: number;
      };
      hideTicketText: () => void;
      showTicketText: () => void;
      updateTicketVisibility: (newScale: number) => void;
      seatsLoaded: boolean;
      containPurchasableNode: (node: KNode) => boolean;
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
  maskJson,
  children,
  addonBefore,
  addonAfter,
  stageContainerWrapper: StageContainerWrapper = Fragment,
  containerClassName,
}: {
  stageJson: TypedNode;
  ticketsJson: TypedNode;
  maskJson?: TypedNode;
  children: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  stageContainerWrapper?: ComponentType<{ children: ReactNode }>;
  containerClassName?: string;
}) => {
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KStage>(null);
  const ticketsRef = useRef<KLayer>(null);
  const masksRef = useRef<KLayer>(null);
  const seatIncludedGroupsRef = useRef<string[]>(null);
  let ticketsShown = false;

  const stageClientRectRef = useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [renderTickets, setRenderTickets] = useState(false);
  const [seatsLoaded, setSeatsLoaded] = useState(false);
  const [_, startTransition] = useTransition();

  // Memoize stage children to prevent unnecessary re-renders
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

  const maskChildren = useMemo(
    () =>
      maskJson?.children?.map((node, idx) => (
        <RenderTicketNode key={`mask-${idx}`} node={node} />
      )),
    [maskJson?.children],
  );

  useEffect(() => {
    const resize = () => {
      if (stageContainerRef.current) {
        const { clientWidth, clientHeight } = stageContainerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setRenderTickets(true), 200);
    return () => clearTimeout(timeout);
  }, [ticketsJson]);

  useEffect(() => {
    if (!renderTickets && !stageRef.current) return;
    masksRef.current?.on('click', (e) => handleZoomToNode(e.target));

    startTransition(() => {
      ticketsRef.current
        ?.find((node: KText) => {
          if (node.className === 'Text') {
            return (
              (node.getParent() as KGroup).find(
                (childNode: KNode) => !!childNode.attrs['data-purchasable'],
              ).length === 0
            );
          }
        })
        .forEach((c) => c.destroy());
    });
  }, [renderTickets]);

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

    if (maskJson) updateTicketVisibility(newScale.x);
  };

  const updateTicketVisibility = (newScale: number) => {
    if (!maskJson) return;
    const zoomedIn =
      (stageClientRectRef.current?.width || 0) * newScale >
      dimensions.width * ZOOM_THRESHOLD;

    if (ticketsShown !== zoomedIn) {
      ticketsRef.current?.visible(zoomedIn);
      ticketsRef.current?.listening(zoomedIn);
      masksRef.current?.visible(!zoomedIn);

      ticketsRef.current?.getLayer()?.batchDraw();

      ticketsShown = zoomedIn;
    }
  };

  const handleZoomToNode = (node: KNode) => {
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 2.5;

    const box = node.getClientRect({ relativeTo: stage });

    const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
      stage.container();

    const newX = -(box.x + box.width / 2) * scaleBy + containerWidth / 2;
    const newY = -(box.y + box.height / 2) * scaleBy + containerHeight / 2;

    stage.to({
      scaleX: scaleBy,
      scaleY: scaleBy,
      x: newX,
      y: newY,
      duration: 0.2,
      onFinish: () => {
        ticketsRef.current?.visible(true);
        ticketsRef.current?.listening(true);
        masksRef.current?.visible(false);

        ticketsRef.current?.getLayer()?.batchDraw();
      },
    });

    stage.scale({ x: scaleBy, y: scaleBy });
    stage.position({ x: newX, y: newY });
  };

  const hideTicketText = () => {
    const ticketsLayer = ticketsRef.current;
    if (!ticketsLayer) return;
    ticketsLayer.find((c: KNode) => c.className === 'Text' && c.visible(false));
  };

  const showTicketText = () => {
    const ticketsLayer = ticketsRef.current;
    if (!ticketsLayer) return;
    ticketsLayer.find((c: KNode) => c.className === 'Text' && c.visible(true));
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
  return (
    <StageContext.Provider
      value={{
        getStage: () => stageRef.current!,
        getTicketsRef: () => ticketsRef.current!,
        getMasksRef: () => masksRef.current!,
        getStageClientRect: () => stageClientRectRef.current!,
        updateTicketVisibility,
        hideTicketText,
        showTicketText,
        seatsLoaded,
        containPurchasableNode,
      }}
    >
      <StageContainerWrapper>
        <div
          className={cn('touch-none select-none', containerClassName)}
          ref={stageContainerRef}
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
                {renderTickets && (
                  <Layer
                    ref={(ref) => {
                      if (ref) {
                        ticketsRef.current = ref;
                        setTimeout(() => setSeatsLoaded(true), 100);
                      }
                    }}
                    name="tickets"
                    listening={false}
                    visible={!maskJson}
                  >
                    {ticketChildren}
                  </Layer>
                )}
                {!!maskJson && (
                  <Layer ref={masksRef} name="masks">
                    {maskChildren}
                  </Layer>
                )}
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
