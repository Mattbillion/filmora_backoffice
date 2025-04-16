import { ReactNode } from 'react';
import Konva from 'konva';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function Section({
  stage,
  label,
  sectionName,
  section,
  children,
}: {
  stage: Konva.Stage;
  label: string;
  sectionName: string;
  section: Konva.Node[];
  children: ReactNode;
}) {
  return (
    <Accordion type="multiple">
      <AccordionItem
        value={label}
        className="px-2 has-[.sector-collapse[data-state=open]]:border has-[.sector-collapse[data-state=open]]:bg-transparent [&[data-state=open]]:rounded-lg [&[data-state=open]]:bg-secondary"
        onMouseLeave={() => {
          const elIndicator = stage.findOne('.el-indicator');
          elIndicator?.to({
            opacity: 0,
            duration: 0.5,
          });
        }}
        onMouseEnter={() => {
          const elIndicator = stage.findOne('.el-indicator');
          const sectionNode = stage.findOne(
            (cc: Konva.Shape) =>
              cc.attrs['data-testid'] === section[0]?.attrs['data-testid'],
          )?.parent;

          if (sectionNode) {
            const {
              x: nodeX,
              y: nodeY,
              width: nodeW,
              height: nodeH,
            } = sectionNode.getClientRect({
              relativeTo: stage,
            });
            elIndicator?.to({
              x: nodeX - 2,
              y: nodeY - 2,
              width: nodeW + 4,
              height: nodeH + 4,
              duration: 0.1,
              opacity: 1,
              visible: true,
            });
          }
        }}
      >
        <AccordionTrigger className="pb-4 pt-2">
          {sectionName.replace(/^Z+(.)/g, 'Zone: $1')}
        </AccordionTrigger>
        <AccordionContent className="[&>div:last-child>div:border-b-0 space-y-2">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
