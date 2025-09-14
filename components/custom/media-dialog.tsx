'use client';
import React, { useState, useEffect } from 'react';
import { getMedia, MediaItem } from '@/lib/functions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { Check, X } from 'lucide-react';

interface MediaDialogProps {
  selectedImages?: string[];
  trigger?: React.ReactNode;
}

export default function MediaDialog({ trigger }: MediaDialogProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  console.log(selectedMediaIds, '<---');

  useEffect(() => {
    getMedia()
      .then((res) => {
        setMediaList(res.data?.data || []);
      })
      .catch((err) => {
        console.log(err, '<---');
      });
  }, []);

  const handleImageSelect = (mediaId: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId],
    );
  };

  const handleRemoveImage = (mediaId: string) => {
    setSelectedMediaIds((prev) => prev.filter((id) => id !== mediaId));
  };

  const handleConfirm = () => {
    const selectedUrls = mediaList
      .filter((media) => selectedMediaIds.includes(media.id))
      .map((media) => media.image_url);

    setIsOpen(false);
    setSelectedImages(selectedUrls);
  };

  const handleCancel = () => {
    setSelectedMediaIds(selectedImages);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex h-[120px] gap-2">
            {selectedImages.map((m: string, idx: number) => (
              <div className="relative aspect-square" key={idx}>
                <X className="absolute right-2 top-2 z-10 size-4 text-white" />
                <Image
                  src={m}
                  alt="selected image"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <DialogTrigger asChild>
          {trigger || <Button variant="outline">Select Images</Button>}
        </DialogTrigger>
      </div>
      <DialogContent className="flex h-[720px] max-w-[820px] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle>
            Select Images ({selectedMediaIds.length} selected)
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full p-4">
          <div className="grid grid-cols-4 gap-4">
            {mediaList?.map((media) => {
              const isSelected = selectedMediaIds.includes(media.id);
              return (
                <div
                  key={media.id}
                  className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleImageSelect(media.id)}
                >
                  <Image
                    src={media.image_url}
                    alt={media.file_name}
                    fill
                    className="object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                      <div className="rounded-full bg-primary p-1 text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  <div className="absolute right-2 top-2">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleImageSelect(media.id)}
                      className="bg-white/90"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter className="border-t border-border p-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedMediaIds.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Select {selectedMediaIds.length} Image
              {selectedMediaIds.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
