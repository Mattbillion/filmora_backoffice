'use client';

import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import { Layer, Stage as KonvaStage } from 'react-konva';
import Konva from 'konva';
import { Edit } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { dataMap, dataMapReverse, translationMap } from './constants';

type KonvaNode = Konva.Node & { children?: KonvaNode[] };

const scaleBy = 1.05;
const maxScale = 10;
const minScale = 0.5;

export default function Stage({
  height,
  width,
  limitX,
  limitY,
  shapes,
  centerCoord,
  scale,
}: {
  height: number;
  width: number;
  limitX: number;
  limitY: number;
  shapes: JSX.Element[];
  centerCoord: { x: number; y: number };
  scale: { x: number; y: number };
}) {
  const stageRef = useRef<Konva.Stage>(null);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate(1);
  }, [shapes]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;
    e.evt.preventDefault();

    const pointer = stage.getPointerPosition();
    const { scale: newScale, position: newPosition } = getZoomInfo({
      deltaY: e.evt.deltaY,
      stage,
      pointer,
    });

    stage.scale(newScale);
    stage.setPosition(newPosition);
  };

  const getZoomInfo = ({
    deltaY,
    stage,
    pointer,
  }: {
    deltaY: number;
    stage: Konva.Stage;
    pointer?: Konva.Vector2d | null;
  }): {
    scale: Konva.Vector2d;
    position: Konva.Vector2d;
    miniMapSize?: { scale: Konva.Vector2d; position: Konva.Vector2d };
  } => {
    const oldScale = stage.scaleX();
    const newScale = deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));
    const zoomInfo = {
      scale: { x: clampedScale, y: clampedScale },
      position: {
        x: stage.x(),
        y: stage.y(),
      },
    };

    if (pointer) {
      const pointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      zoomInfo.position = {
        x: pointer.x - pointTo.x * clampedScale,
        y: pointer.y - pointTo.y * clampedScale,
      };
    }

    return zoomInfo;
  };

  const stageChilds = (stageRef.current
    ?.getLayers()[0]
    ?.children?.filter((c) => c.getType() === 'Group') ||
    []) as unknown as KonvaNode[];

  const focusNode = (n: KonvaNode) => {
    n.getParent()!.children!.map((c: KonvaNode) => {
      const isSelected = c._id === n._id;
      c.clearCache?.();
      c.to({
        opacity: isSelected ? 1 : 0.15,
        duration: 0.1,
      });
      c.children?.map((cc) => {
        cc.clearCache?.();
        cc.setAttr('opacity', 1);
      });

      if (!isSelected) c.cache();
    });
  };

  return (
    <div className="flex">
      <KonvaStage
        ref={stageRef}
        width={width}
        height={height}
        draggable
        scale={scale}
        x={centerCoord.x}
        y={centerCoord.y}
        onWheel={handleWheel}
        dragBoundFunc={(pos) => {
          const currentScale = stageRef.current?.scaleX() || scale.x;
          const scaledLimit = {
            x: limitX * currentScale,
            y: limitY * currentScale,
          };
          const newX = Math.max(-scaledLimit.x, Math.min(pos.x, scaledLimit.x));
          const newY = Math.max(-scaledLimit.y, Math.min(pos.y, scaledLimit.y));

          return { x: newX, y: newY };
        }}
        className="flex-1"
      >
        <Layer>{shapes}</Layer>
      </KonvaStage>
      <div className="flex h-[calc(100dvh-64px)] flex-[462px] flex-col border-l border-border">
        <h1 className="border-b p-4">Seatmap builder</h1>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Tabs
            className="flex min-h-full w-full flex-col"
            defaultValue={'empty'}
          >
            <TabsList className="w-full rounded-none border-b border-border">
              {stageChilds?.map((node, idx) => (
                <TabsTrigger
                  value={node._id.toString()}
                  key={idx}
                  className="flex-1"
                  onClick={() =>
                    stageChilds.map((c) => {
                      const isSelected = c._id === node._id;

                      if (isSelected) c.clearCache();
                      else c.cache();

                      c.to({
                        opacity: isSelected ? 1 : 0.15,
                        duration: 0.2,
                      });
                    })
                  }
                >
                  {node.attrs['data-name'] || node.id() || 'N/A (Edit!)'}
                </TabsTrigger>
              ))}
            </TabsList>
            {stageChilds?.map((node, idx) => (
              <TabsContent
                value={node._id.toString()}
                key={idx}
                className="flex-1 p-4 pt-0"
              >
                <LayerTypeSelect
                  node={node}
                  onChange={(v) => {
                    forceUpdate((c) => c + 1);
                    node.id(v);
                  }}
                  options={[
                    { label: 'Background', value: 'bg' },
                    { label: 'Tickets / Seats', value: 'tickets' },
                    { label: 'Mask', value: 'masks' },
                  ]}
                  className="mb-4"
                />
                {node.id() === 'tickets' && (
                  <>
                    {node.hasChildren() ? (
                      <Accordion type="single" className="w-full">
                        {node.children?.map((childNode, idx1) => {
                          const nodeType = childNode.attrs['data-type'];
                          const nodeTypeValue =
                            childNode.attrs?.[`data-${nodeType}`];

                          return (
                            <LayerAccordion
                              onMouseEnter={() => focusNode(childNode)}
                              key={idx1}
                              label={
                                (translationMap[nodeType]
                                  ? translationMap[nodeType] + ': '
                                  : '') + (nodeTypeValue || 'N/A')
                              }
                              value={childNode._id.toString()}
                            >
                              <div className="flex items-center justify-between gap-4 px-0.5">
                                <LayerTypeSelect
                                  node={childNode}
                                  onChange={() => forceUpdate((c) => c + 1)}
                                  options={Object.values(dataMap).map((c) => ({
                                    label: translationMap[c],
                                    value: c,
                                  }))}
                                  className="flex-1"
                                />
                                {!!nodeType && (
                                  <LayerNameInput
                                    node={childNode}
                                    onChange={() => forceUpdate((c) => c + 1)}
                                    onFocus={() => focusNode(childNode)}
                                    className="flex-1"
                                  />
                                )}
                              </div>
                              {!!nodeType &&
                                !!nodeTypeValue &&
                                !!childNode.children?.length &&
                                childNode.children.map((child, idx2) => (
                                  <LayerChildCollapse
                                    key={idx2}
                                    focusNode={focusNode}
                                    forceUpdate={() =>
                                      forceUpdate((c) => c + 1)
                                    }
                                    childNode={child}
                                  />
                                ))}
                            </LayerAccordion>
                          );
                        })}
                      </Accordion>
                    ) : (
                      <div>No child layer</div>
                    )}
                  </>
                )}
              </TabsContent>
            ))}
            <TabsContent
              value="empty"
              className="flex flex-1 flex-col items-center justify-center"
            >
              Select stage layer to edit
            </TabsContent>
          </Tabs>
        </div>
        <Button
          className="m-4"
          onClickCapture={() =>
            stageRef.current?.find((c: KonvaNode) => {
              c.to({
                opacity: 1,
                duration: 0,
              });
              c.clearCache?.();
              return true;
            })
          }
          onClick={() => {
            setTimeout(() => console.log(stageRef.current?.toObject()), 500);
          }}
        >
          Build
        </Button>
      </div>
    </div>
  );
}

function LayerAccordion({
  onMouseEnter,
  label,
  children,
  value,
}: {
  onMouseEnter: () => void;
  label: string;
  children: ReactNode;
  value: string;
}) {
  return (
    <AccordionItem
      value={value}
      className="border-none px-2 has-[.collapsible-child[data-state=open]]:border has-[.collapsible-child[data-state=open]]:bg-transparent [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
      onMouseEnter={onMouseEnter}
    >
      <AccordionTrigger className="px-0.5 py-2" onMouseEnter={onMouseEnter}>
        {label}
      </AccordionTrigger>
      <AccordionContent className="[&>div:last-child>div:border-b-0 space-y-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function LayerChildCollapse({
  focusNode,
  forceUpdate,
  childNode,
}: {
  focusNode: (node: KonvaNode) => void;
  forceUpdate: () => void;
  childNode: KonvaNode;
}) {
  const dataNodeType = childNode.attrs['data-type'];
  const children = childNode.children ?? [];
  const nodeType = translationMap[dataNodeType]
    ? translationMap[dataNodeType] + ': '
    : '';
  const nodeTypeValue = childNode.attrs?.[`data-${dataNodeType}`] || 'N/A';

  const handleFocusNode = () => focusNode(childNode);
  const { isSeatGroup } = analyzeSeatGroup(children);
  return (
    <Collapsible
      className="w-full has-[&>.collapsible-child[data-state=open]]:bg-transparent [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
      onMouseEnter={handleFocusNode}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between p-2"
          onMouseEnter={handleFocusNode}
        >
          {nodeType + nodeTypeValue}
          <Edit />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsible-child space-y-2 p-2">
        <div className="flex items-center justify-between gap-4">
          <LayerTypeSelect
            node={childNode}
            onChange={forceUpdate}
            options={Object.values(dataMap).map((c) => ({
              label: translationMap[c],
              value: c,
            }))}
            className="flex-1"
          />
          {!!nodeType && (
            <LayerNameInput
              node={childNode}
              onChange={forceUpdate}
              onFocus={handleFocusNode}
              className="flex-1"
            />
          )}
        </div>
        {!!nodeType && !!nodeTypeValue && isSeatGroup
          ? 'seats'
          : children.map((child, index) => (
              <LayerChildCollapse
                key={child._id || index}
                focusNode={focusNode}
                forceUpdate={forceUpdate}
                childNode={child}
              />
            ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function analyzeSeatGroup(children: KonvaNode[]): {
  isSeatGroup: boolean;
  seatCount: number;
} {
  let seatLikeChildren = 0;

  for (const child of children) {
    // Recursive check (seat can be grouped)
    if (child.children && child.children.length > 0) {
      const inner = analyzeSeatGroup(child.children);
      seatLikeChildren += inner.seatCount;
    } else if (isLikelySeatNode(child)) {
      seatLikeChildren += 1;
    }
  }

  const isSeatGroup = seatLikeChildren >= 2; // Path /seat shape/ Path /seat component/ Text /number or label/

  return { isSeatGroup, seatCount: seatLikeChildren };
}

function isLikelySeatNode(node: KonvaNode): boolean {
  if (!node) return false;

  const type = node.className || '';

  const isPathOrShape = ['Path', 'Shape', 'Line', 'Rect', 'Circle'].includes(
    type,
  );
  const isTextWithNumber = type === 'Text' && /\d/.test(node.attrs.text || '');

  return isPathOrShape || isTextWithNumber;
}

function LayerTypeSelect({
  node,
  onChange,
  options,
  className,
}: {
  node: Konva.Node & { children?: Konva.Node[] };
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>Layer Type:</Label>
      <Select
        defaultValue={node.attrs['data-type'] || node.id()}
        onValueChange={(val) => {
          node.setAttr('data-type', val);
          onChange(val);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select layer type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o, idx) => (
            <SelectItem value={o.value} key={idx}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const getFieldInfo = (node: KonvaNode) => {
  const field = `data-${node.attrs['data-type']}`;
  let label = translationMap[field.replace('data-', '')] + ': ';
  let placeholder = node.attrs[field] || '';

  return {
    field,
    label,
    placeholder,
  };
};

function LayerNameInput({
  node,
  onFocus,
  onChange,
  className,
}: {
  node: Konva.Node & { children?: Konva.Node[] };
  onFocus?: () => void;
  onChange?: (val: string) => void;
  className?: string;
}) {
  const { field, label, placeholder } = getFieldInfo(node);
  const [value, setValue] = useState(node.attrs[field]?.replace('_', ' '));
  const nodeId = node.id() || node.attrs['data-testid'];

  return (
    <div className={cn('space-y-2', className)} onMouseEnter={onFocus}>
      <Label htmlFor={nodeId + field}>{label}</Label>
      <Input
        id={nodeId + field}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          onChange?.(val);
          manipulateAttrs(node, field, val.replace(/\s/g, '_'));
        }}
        onFocus={onFocus}
        placeholder={`Current: ${placeholder || 'N/A'}`}
        className="!h-9 flex-1 rounded-sm border-neutral-400 dark:border-neutral-600 dark:bg-neutral-600"
      />
    </div>
  );
}

const modifyId = (id: string = '', field: string = '', val: string) => {
  let newId;
  const reversedK = dataMapReverse[field.replace('data-', '')];
  const reg = new RegExp(`(?<=-|^)(${reversedK}[^-]*)(?=-|$)`);

  if (reg.test(id)) {
    newId = id.replace(reg, `${reversedK}${val}`);
  } else {
    const parts = id.split('-');
    parts.splice(parts.length - 1, 0, `${reversedK}${val}`);
    newId = parts.join('-');
  }

  return newId;
};

const manipulateAttrs = (n: KonvaNode, field: string, value: string) => {
  if (n.hasChildren()) {
    const nodeChildren = n.children!;
    for (let i = 0; i < nodeChildren.length; i++) {
      const child = nodeChildren[i];
      const childId = child.id() || '';

      if (child.hasChildren()) manipulateAttrs(child, field, value);
      if (child.getType() !== 'Text') {
        child.setAttr('id', modifyId(childId, field, value));
        child.setAttr(field, value);
      }
    }
  }
  n.setAttr('id', modifyId(n.id(), field, value));
  n.setAttr(field, value);
};
