'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Content } from './Content';

export function MediaDialog({
  updateAction,
  triggerSize = 'default',
}: {
  updateAction?: (image: unknown) => void;
  triggerSize?: 'default' | 'lg';
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={triggerSize === 'lg' ? 'lg' : 'default'}
          >
            {triggerSize === 'lg' ? 'Media Library' : 'Open Dialog'}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[1200px] min-w-[720px] overflow-hidden p-0">
          <DialogHeader className="border-border border-b bg-slate-50 px-4 py-3">
            <DialogTitle className="text-md">Media manager</DialogTitle>
          </DialogHeader>

          {isOpen && <Content updateAction={updateAction} />}

          <DialogFooter className="p-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
