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

import { translationMap } from './constants';

export function Sector({
  stage,
  sector,
}: {
  stage: Konva.Stage;
  sector: Konva.Node & { children?: Konva.Node[] };
}) {
  const [count, setCount] = useState(0);
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

  if (sector.attrs['data-floor'] === '5') console.log(sector.children);
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
          // onClick={() => {
          //   const existedMask = masks.some(
          //     (c) =>
          //       c.id ===
          //       sector.attrs['data-testid'],
          //   );
          //   node?.visible(existedMask);
          //   if (existedMask)
          //     return setMasks(
          //       masks.filter(
          //         (f) =>
          //           f.id !==
          //           sector.attrs['data-testid'],
          //       ),
          //     );
          //   setMasks([
          //     ...masks,
          //     {
          //       id: sector.attrs['data-testid'],
          //       x: nodeX,
          //       y: nodeY,
          //       width: nodeW,
          //       height: nodeH,
          //     },
          //   ]);
          // }}
        >
          Section:{' '}
          {sector.attrs?.['data-sector'] || sector.attrs?.['data-name']}
          <Edit />
          {/*<Checkbox*/}
          {/*  checked={masks.some(*/}
          {/*    (c) =>*/}
          {/*      c.id ===*/}
          {/*      sector.attrs['data-testid'],*/}
          {/*  )}*/}
          {/*/>*/}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2">
          <div className="border-b border-neutral-700 px-4 py-2">
            <SectorInput
              node={sector}
              dataFields={['data-sector', 'data-name']}
            />
          </div>
          {sector.children
            ?.filter((c) => c.attrs['data-purchasable'])
            ?.map((c, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b border-neutral-700 px-4 py-2 font-mono text-sm shadow-sm last:border-b-0"
                  onMouseEnter={() => {
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
                  }}
                >
                  <SectorInput
                    node={c}
                    dataFields={['data-row', 'data-room']}
                  />
                  <SectorInput node={c} dataFields={['data-price']} />
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
  let label =
    translationMap[field.replace('data-', '')] +
    ': ' +
    (node.attrs[field] || '');

  for (let i = 0; i < fields.length; i++) {
    if (node.attrs[fields[i]]) {
      label =
        translationMap[fields[i].replace('data-', '')] +
        ': ' +
        node.attrs[fields[i]];
      field = fields[i];
    }
  }

  return {
    field,
    label,
  };
};

function SectorInput({
  node,
  dataFields,
}: {
  node: Konva.Node & { children?: Konva.Node[] };
  dataFields: string[];
}) {
  const { field, label } = getFieldInfo(node, dataFields);
  const [value, setValue] = useState(node.attrs[field]);

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={node.id() + field}>{label}</Label>
      <Input
        id={node.id() + field}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          node.setAttr(field, e.target.value);
        }}
        placeholder={`Current: ${label.split(': ')[1]}`}
        className="flex-1 rounded-sm bg-neutral-600"
      />
    </div>
  );
}
