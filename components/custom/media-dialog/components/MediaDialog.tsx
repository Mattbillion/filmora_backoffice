'use client';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMedia } from '@/services/medias';
import { MediaItemType } from '@/services/medias/schema';

import { mediaColumns } from './columns';

interface MediaDialogProps {
  onImagesSelected?: (images: MediaItemType[]) => void;
}

export function MediaDialog({ onImagesSelected }: MediaDialogProps) {
  const [medias, setMedias] = useState<MediaItemType[]>([]);
  const [selectedMedias, setSelectedMedias] = useState<MediaItemType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMedia()
      .then((res) => {
        if (res.data?.status === 'success') {
          setMedias(res.data?.data || []);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  const handleSelectImages = () => {
    console.log('Selected medias', selectedMedias);
    onImagesSelected?.(selectedMedias);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[920px] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-border border-b bg-slate-50 px-4 py-3">
          <DialogTitle className="text-md">
            Media manager{' '}
            {selectedMedias.length > 0 && `(${selectedMedias.length} selected)`}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <DataTable
            columns={mediaColumns}
            data={medias}
            onSelectedMedias={setSelectedMedias}
            hidePagination
          />
        </ScrollArea>

        <DialogFooter className="p-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSelectImages}
            disabled={selectedMedias.length === 0}
          >
            Select {selectedMedias.length} image
            {selectedMedias.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
