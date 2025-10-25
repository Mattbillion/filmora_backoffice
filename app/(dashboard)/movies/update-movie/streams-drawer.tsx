'use client';

import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface StreamsDrawerRef {
  open: () => void;
  close: () => void;
  toggle?: () => void;
}

interface StreamsDrawerProps {
  trigger?: ReactNode;
  className?: string;
  footer?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  initialOpen?: boolean;
}

const StreamsDrawer = forwardRef<StreamsDrawerRef, StreamsDrawerProps>(
  ({ trigger, className, footer, onOpenChange, initialOpen = false }, ref) => {
    const [open, setOpen] = useState<boolean>(initialOpen);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((s) => !s),
    }));

    return (
      <Drawer
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          onOpenChange?.(v);
        }}
      >
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

        <DrawerContent className={cn('h-[90vh]', className)}>
          <DrawerHeader className="bg-background p-4">
            <DrawerTitle className="text-lg">Кино видео сонгох</DrawerTitle>
          </DrawerHeader>
          <div className="mx-auto min-h-0 max-w-[900px] flex-1 space-y-4 pt-4 pb-4">
            <ScrollArea className="h-auto overflow-y-auto">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Architecto assumenda autem blanditiis consequatur consequuntur
              cupiditate debitis eius exercitationem laborum libero magni
              maiores molestias, mollitia necessitatibus recusandae, sunt
              veritatis. Laboriosam, tenetur?
            </ScrollArea>

            {footer && (
              <DrawerFooter className="px-4 pt-4">{footer}</DrawerFooter>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
);

StreamsDrawer.displayName = 'StreamsDrawer';

export default StreamsDrawer;
