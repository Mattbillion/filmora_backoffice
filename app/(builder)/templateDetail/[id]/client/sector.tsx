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

export function Sector({
  stage,
  sector,
}: {
  stage: Konva.Stage;
  sector: Konva.Node & { children?: Konva.Node[] };
}) {
  const node = stage.findOne(
    (cc: Konva.Shape) =>
      cc.attrs['data-testid'] === sector.attrs?.['data-testid'],
  );
  if (!node) return null;

  const {
    x: nodeX,
    y: nodeY,
    width: nodeW,
    height: nodeH,
  } = node.getClientRect({
    relativeTo: stage,
  });

  const elIndicator = stage.findOne('.el-indicator');

  // if (sector.attrs['data-floor'] === '5') console.log(sector.children);
  return (
    <Collapsible
      className="sector-collapse w-full [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
      onMouseEnter={() => {
        elIndicator?.to({
          x: nodeX - 2,
          y: nodeY - 2,
          width: nodeW + 4,
          height: nodeH + 4,
          duration: 0.1,
          opacity: 1,
          visible: true,
        });
      }}
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
              onFocus={() => {
                elIndicator?.to({
                  x: nodeX - 2,
                  y: nodeY - 2,
                  width: nodeW + 4,
                  height: nodeH + 4,
                  duration: 0.1,
                  opacity: 1,
                  visible: true,
                });
              }}
            />
          </div>
          {sector.children
            ?.filter((c) => c.attrs['data-purchasable'])
            ?.map((c, idx) => {
              const placeIndicator = () => {
                const {
                  x: rowX,
                  y: rowY,
                  width: rowW,
                  height: rowH,
                } = c.getClientRect({
                  relativeTo: stage,
                });
                elIndicator?.setAttr('cornerRadius', 2);
                elIndicator?.setAttr('strokeWidth', 1);
                elIndicator?.to({
                  x: rowX - 2,
                  y: rowY - 2,
                  width: rowW + 4,
                  height: rowH + 4,
                  duration: 0.1,
                  opacity: 1,
                  visible: true,
                });
              };
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b border-neutral-700 px-4 py-2 font-mono text-sm shadow-sm last:border-b-0"
                >
                  <SectorInput
                    node={c}
                    dataFields={['data-row', 'data-room']}
                    onFocus={placeIndicator}
                  />
                  <SectorInput
                    node={c}
                    dataFields={['data-price']}
                    onFocus={placeIndicator}
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
  fields: string[],
) => {
  let field = fields[0];
  let label = translationMap[field.replace('data-', '')] + ': ';
  let placeholder = node.attrs[field] || '';

  for (let i = 0; i < fields.length; i++) {
    if (node.attrs[fields[i]]) {
      const mappingKey = fields[i].replace('data-', '');

      label = translationMap[mappingKey] + ': ';
      field = fields[i];
      placeholder = ['price', 'unit'].includes(mappingKey)
        ? currencyFormat(
            node.attrs[fields[i]],
            mappingKey === 'price' ? undefined : '',
          )
        : node.attrs[fields[i]];
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
  const [value, setValue] = useState(node.attrs[field]);
  const nodeId = node.id();

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={nodeId + field}>{label}</Label>
      <Input
        id={nodeId + field}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          const dataKey = field.replace('data-', '');
          const reversedK =
            dataMapReverse[dataKey === 'name' ? 'sector' : dataKey];
          const reg = new RegExp(`(?<=-)(${reversedK}[^-]*)(?=-|$)`);

          node.setAttr('id', nodeId.replace(reg, `${reversedK}${val}`));
          node.setAttr(field, val);
          setValue(val);
        }}
        onFocus={onFocus}
        placeholder={`Current: ${placeholder}`}
        className="flex-1 rounded-sm bg-neutral-600"
      />
    </div>
  );
}
