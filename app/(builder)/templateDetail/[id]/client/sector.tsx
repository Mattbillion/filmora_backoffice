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

export function Sector({
  stage,
  sector,
}: {
  stage: Konva.Stage;
  sector: Konva.Node & { children?: Konva.Node[] };
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

  const elIndicator = stage.findOne('.el-indicator');

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
      <CollapsibleContent>
        <div className="space-y-2">
          <div className="border-b border-neutral-700 px-4 py-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={sector.id() + '-sector-name'}>Section name</Label>
              <Input
                id={sector.id() + '-sector-name'}
                placeholder={`Current: ${sector.id().match(/S([^-]+)/)?.[1]}`}
                onChange={(e) => {
                  if (e.target.value) {
                    sector.setAttr('data-sector', e.target.value);
                  } else {
                    sector.setAttr(
                      'data-sector',
                      sector
                        .id()
                        .match(/S[^-]+/)?.[0]
                        ?.replace('S', ''),
                    );
                  }
                }}
                className="flex-1 rounded-sm bg-neutral-600"
              />
            </div>
          </div>
          {sector.children?.map((c, idx) => {
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
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={c.id() + '-row-number'}>
                    {c.id().replace(/(\S+-R(\d+))$/g, 'Row number: $2')}
                  </Label>
                  <Input
                    id={c.id() + '-row-number'}
                    onChange={(e) => {
                      if (e.target.value) {
                        c.id(
                          c
                            .id()
                            .replace(
                              /(S+)(-R\d+)?(-|$)/,
                              `$1-R${e.target.value}$3`,
                            ),
                        );
                        c.setAttr('data-row', e.target.value);
                      } else {
                        c.setAttr(
                          'data-row',
                          c
                            .id()
                            .match(/R[^-]+/)?.[0]
                            ?.replace('R', ''),
                        );
                      }
                    }}
                    placeholder={`Current: ${c.id().match(/R([^-]+)/)?.[1]}`}
                    className="flex-1 rounded-sm bg-neutral-600"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={c.id() + '-price'}>Price</Label>
                  <Input
                    id={c.id() + '-price'}
                    onChange={(e) => {
                      c.clearCache();
                      c.setAttr('data-price', e.target.value);
                      c.setAttr(
                        'id',
                        c
                          .id()
                          .replace(
                            /(R\d+)(-P\d+)?(-|$)/,
                            `$1-P${e.target.value}$3`,
                          ),
                      );
                      c.cache();
                    }}
                    placeholder={`Current: ${currencyFormat(Number(c.id().match(/P([^-]+)/)?.[1] || 0))}`}
                    className="flex-1 rounded-sm bg-neutral-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
