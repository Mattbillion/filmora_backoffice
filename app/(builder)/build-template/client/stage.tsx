'use client';

import { Fragment, ReactNode } from 'react';
import Konva from 'konva';
import { flatten, partition } from 'lodash';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { KonvaNode } from '../schema';
import { AdditionalInformation } from './additional-information';
import { dataMap, locationMap, translationMap } from './constants';
import { useKonvaStage } from './context';
import {
  LayerTypeSelect,
  LayerValueInput,
  modifyId,
} from './layer-form-inputs';
import { CreateTemplateDialog } from './template-create-form';

export default function TicketEditor() {
  const { stageChilds, baseLayer, focusNode, forceUpdate } = useKonvaStage();

  return (
    <Fragment>
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
                onClick={() => {
                  baseLayer?.cache();
                  baseLayer?.setAttr('opacity', 0.15);
                  focusNode(node);
                }}
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
                skipManipulate
                node={node}
                onChange={(v) => {
                  forceUpdate();
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
                                onChange={() => forceUpdate()}
                                options={Object.values(locationMap).map(
                                  (c) => ({
                                    label: translationMap[c],
                                    value: c,
                                  }),
                                )}
                                className="flex-1"
                              />
                              {!!nodeType && (
                                <LayerValueInput
                                  key={nodeType}
                                  node={childNode}
                                  onChange={() => forceUpdate()}
                                  onFocus={() => focusNode(childNode)}
                                  className="flex-1"
                                  debounce={100}
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
                                  forceUpdate={() => forceUpdate()}
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
      <CreateTemplateDialog />
    </Fragment>
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
  const nodeTypeValue = childNode.attrs?.[`data-${dataNodeType}`];

  const handleFocusNode = () => focusNode(childNode);
  const { isSeatGroup } = analyzeSeatGroup(children);

  return (
    <Collapsible
      className="w-full has-[&>.collapsible-child[data-state=open]]:border has-[&>.collapsible-child[data-state=open]]:bg-transparent [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
      onMouseEnter={handleFocusNode}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between p-2"
          onMouseEnter={handleFocusNode}
        >
          {nodeType + (nodeTypeValue || 'N/A')}
          <Edit />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsible-child space-y-2 p-2">
        <div className="flex items-center justify-between gap-4">
          <LayerTypeSelect
            node={childNode}
            onChange={forceUpdate}
            options={Object.values(locationMap).map((c) => ({
              label: translationMap[c],
              value: c,
            }))}
            className="flex-1"
          />
          {!!nodeType && (
            <LayerValueInput
              key={nodeType}
              node={childNode}
              onChange={forceUpdate}
              onFocus={handleFocusNode}
              debounce={100}
              className="flex-1"
            />
          )}
        </div>
        {!!nodeType && !!nodeTypeValue ? (
          isSeatGroup ? (
            <>
              <AdditionalInformation
                node={childNode}
                onChange={forceUpdate}
                onFocus={handleFocusNode}
              />
              <TicketsGroup
                childNode={childNode}
                focusNode={focusNode}
                forceUpdate={forceUpdate}
                childrenList={children}
              />
            </>
          ) : (
            children.map((child, index) => (
              <LayerChildCollapse
                key={child._id || index}
                focusNode={focusNode}
                forceUpdate={forceUpdate}
                childNode={child}
              />
            ))
          )
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}

function TicketsGroup({
  childrenList,
  childNode,
  focusNode,
  forceUpdate,
}: {
  childrenList: KonvaNode[];
  childNode: KonvaNode;
  focusNode: (node: KonvaNode) => void;
  forceUpdate: () => void;
}) {
  const groups: KonvaNode[][] = [];
  let currentGroup: KonvaNode[] = [];

  childrenList.forEach((child) => {
    if (child.className === 'Text') {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      currentGroup.push(child);
    }
  });

  if (currentGroup.length > 0) groups.push(currentGroup);

  const [nearSeatShapes] = partition(flatten(groups), (shape) => {
    if (shape.className === 'Text') return false;
    if (!shape.attrs['data-type']) shape.setAttr('data-type', 'seat');
    const { width, height } = shape.getClientRect();
    const aspectRatio = width / height;
    return Math.abs(aspectRatio - 1) <= 0.5;
  });

  const parent = childNode;
  const baseStage = childNode.getStage()?.getLayers()[0];

  const seatShapes = nearSeatShapes.map((shape) => {
    const selectedBox = shape.getClientRect({
      relativeTo: baseStage,
    });

    //@ts-ignore
    const candidates = parent?.find('Text') as Konva.Text[];

    for (const textNode of candidates) {
      const textBox = textNode.getClientRect({
        relativeTo: baseStage,
      });

      const intersects =
        selectedBox.x < textBox.x + textBox.width &&
        selectedBox.x + selectedBox.width > textBox.x &&
        selectedBox.y < textBox.y + textBox.height &&
        selectedBox.y + selectedBox.height > textBox.y;

      if (intersects) {
        const shapeType = shape.attrs['data-type'];
        const seatText = textNode.attrs.text;
        shape.id(modifyId(shape.id(), shapeType, seatText));
        shape.setAttr(`data-${shapeType}`, seatText);
      }
    }

    if (typeof shape.attrs['data-purchasable'] === 'undefined')
      shape.setAttr('data-purchasable', true);
    return shape;
  });

  return (
    <>
      <p className="mb-2 border-b pb-2 pt-4 font-bold">
        Tickets ({seatShapes.length || 0})
      </p>
      {seatShapes.map((child, idx) => {
        const canPurchase = child.getAttr('data-purchasable');
        return (
          <div
            key={idx}
            onMouseEnter={() => focusNode(child)}
            className="flex items-center justify-between gap-4"
          >
            <LayerTypeSelect
              node={child}
              onChange={forceUpdate}
              options={Object.values(dataMap)
                .filter((c) =>
                  ([dataMap.t, dataMap.s, dataMap.r] as string[]).includes(c),
                )
                .map((c) => ({
                  label: translationMap[c],
                  value: c,
                }))}
              className="flex-1"
              hideLabel
              disabled={!canPurchase}
            />
            <LayerValueInput
              node={child}
              onChange={forceUpdate}
              className="flex-1"
              hideLabel
              disabled={!canPurchase}
            />
            <Switch
              checked={canPurchase}
              onCheckedChange={(checked) => {
                child.setAttr('data-purchasable', checked);
                forceUpdate();
              }}
            />
          </div>
        );
      })}
    </>
  );
}

function analyzeSeatGroup(children: KonvaNode[]): {
  isSeatGroup: boolean;
  seatCount: number;
} {
  let seatLikeChildren = 0;

  for (const child of children) {
    if (isLikelySeatNode(child)) {
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
