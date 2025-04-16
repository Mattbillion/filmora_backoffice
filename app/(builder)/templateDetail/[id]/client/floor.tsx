import { ReactNode } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function Floor({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={label} className="rounded-lg border px-2">
        <AccordionTrigger>
          {label.replace(/^F+(\d+)/g, 'Floor: $1')}
        </AccordionTrigger>
        <AccordionContent className="space-y-2 [&>div:last-child>div]:border-b-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
