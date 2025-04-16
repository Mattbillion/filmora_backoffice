import Konva from 'konva';
import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function Sector({
  stage,
  sector,
}: {
  stage: Konva.Stage;
  sector: Konva.Node;
}) {
  const node = stage.findOne(
    (cc: Konva.Shape) =>
      cc.attrs['data-testid'] === sector.attrs['data-testid'],
  );
  if (!node) return null;

  // @ts-ignore
  let sectorName = sector
    .id()
    .split(/[\s-]+/)
    .at(-1)
    .replace('_', ' ');

  if (/(\S+-S(\d+))$/g.test(sector.id()))
    sectorName = sector.id().replace(/(\S+-S(\d+))$/g, 'Section: $2');

  const {
    x: nodeX,
    y: nodeY,
    width: nodeW,
    height: nodeH,
  } = node.getClientRect({
    relativeTo: stage,
  });

  return (
    <Collapsible
      className="sector-collapse w-full [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
      onMouseEnter={() => {
        const elIndicator = stage.findOne('.el-indicator');
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
          {sectorName}
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
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          @radix-ui/primitives
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
