'use client';

import { useState } from 'react';
import Konva from 'konva';
import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { currencyFormat } from '@/lib/utils';

import { dataMapReverse, translationMap } from './constants';

type KonvaNode = Konva.Node & { children?: Konva.Node[] };
type ShapeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function Sector({
  stage,
  sector,
}: {
  stage: Konva.Stage;
  sector: KonvaNode;
}) {
  const node = stage.findOne(
    (cc: Konva.Shape) =>
      cc.attrs['data-testid'] === sector.attrs?.['data-testid'],
  );
  if (!node) return null;

  const getShapeRect = (n: KonvaNode) => n.getClientRect({ relativeTo: stage });

  const nodeRect = getShapeRect(node);

  const elIndicator = stage.findOne('.el-indicator');
  const navigateIndicator = (shapeRect: ShapeRect) =>
    elIndicator?.to({
      x: shapeRect.x - 2,
      y: shapeRect.y - 2,
      width: shapeRect.width + 4,
      height: shapeRect.height + 4,
      duration: 0.1,
      opacity: 1,
      visible: true,
    });

  // if (sector.attrs['data-floor'] === '5') console.log(sector.children);
  return (
    <Collapsible
      className="sector-collapse w-full [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
      onMouseEnter={() => navigateIndicator(nodeRect)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between"
        >
          Sector: {sector.attrs?.['data-sector'] || sector.attrs?.['data-name']}
          <Edit />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2">
          <div className="border-b border-neutral-700 px-4 py-2">
            <SectorInput
              node={sector}
              dataFields={['data-sector', 'data-name']}
              onFocus={() => navigateIndicator(nodeRect)}
            />
          </div>
          {sector.children
            ?.filter((c) => c.attrs['data-purchasable'])
            ?.map((c, idx) => {
              const rowRect = getShapeRect(c);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b border-neutral-700 px-4 py-2 font-mono text-sm shadow-sm last:border-b-0"
                >
                  <SectorInput
                    node={c}
                    dataFields={['data-row', 'data-room']}
                    onFocus={() => navigateIndicator(rowRect)}
                  />
                  <SectorInput
                    node={c}
                    dataFields={['data-price']}
                    onFocus={() => navigateIndicator(rowRect)}
                  />
                </div>
              );
            })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const getFieldInfo = (
  node: Konva.Node & { children?: Konva.Node[] },
  fields: string[] = [],
) => {
  let [field, ...rest] = fields;
  let label = translationMap[field.replace('data-', '')] + ': ';
  let placeholder = node.attrs[field] || '';

  for (let i = 0; i < rest.length; i++) {
    const currentField = rest[i];

    if (node.attrs[currentField]) {
      const mappingKey = currentField.replace('data-', '');

      label = translationMap[mappingKey] + ': ';
      field = currentField;
      placeholder =
        mappingKey === 'price' || mappingKey === 'unit'
          ? currencyFormat(
              node.attrs[currentField],
              mappingKey === 'price' ? undefined : '',
            )
          : node.attrs[currentField];
    }
  }

  return {
    field,
    label,
    placeholder,
  };
};

function SectorInput({
  node,
  dataFields,
  onFocus,
}: {
  node: Konva.Node & { children?: Konva.Node[] };
  dataFields: string[];
  onFocus?: () => void;
}) {
  const { field, label, placeholder } = getFieldInfo(node, dataFields);
  const [value, setValue] = useState(node.attrs[field]?.replace('_', ' '));
  const nodeId = node.id();
  const dataKey = field.replace('data-', '');
  const reversedK = dataMapReverse[dataKey === 'name' ? 'sector' : dataKey];
  const reg = new RegExp(`(?<=-)(${reversedK}[^-]*)(?=-|$)`);

  const modifyId = (id: string, val: string) => {
    let newId;

    if (reg.test(id)) {
      newId = id.replace(reg, `${reversedK}${val}`);
    } else {
      const parts = id.split('-');
      parts.splice(parts.length - 1, 0, `${reversedK}${val}`);
      newId = parts.join('-');
    }

    return newId;
  };

  const replaceChildrenId = (n: KonvaNode, val: string) => {
    if (n.hasChildren()) {
      const nodeChildren = n.children!;
      for (let i = 0; i < nodeChildren.length; i++) {
        const child = nodeChildren[i];
        const childId = child.id();
        if (child.hasChildren()) replaceChildrenId(child, val);
        if (childId) {
          child.setAttr('id', modifyId(childId, val));
          child.setAttr(field, val);
        }
      }
    }
    n.setAttr('id', modifyId(n.id(), val));
    n.setAttr(field, val);
  };

  return (
    <div className="flex flex-col space-y-1.5" onMouseEnter={onFocus}>
      <Label htmlFor={nodeId + field}>{label}</Label>
      <Input
        id={nodeId + field}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          replaceChildrenId(node, val.replace(/\s/g, '_'));
        }}
        onFocus={onFocus}
        placeholder={`Current: ${placeholder || 'N/A'}`}
        className="flex-1 rounded-sm bg-neutral-600"
      />
    </div>
  );
}
