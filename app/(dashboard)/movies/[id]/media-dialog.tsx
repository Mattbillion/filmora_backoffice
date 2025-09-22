import React, { useEffect, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';

import { Button, ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUploadedImages } from '@/services/images';
import { ImageInfoType } from '@/services/schema';

export function MediaDialog({
  updateAction,
  triggerSize,
}: {
  updateAction: (image: ImageInfoType) => void;
  triggerSize?: 'sm' | 'md' | 'lg';
}) {
  const [images, setImages] = useState<ImageInfoType[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageInfoType | null>(
    null,
  );
  useEffect(() => {
    const fetchImages = async () => {
      const response = await getUploadedImages({
        page_size: 100,
      });
      setImages(response.data);
    };
    fetchImages();
  }, []);

  const handleSelectImage = (image: ImageInfoType) => {
    setSelectedImage(image);
  };

  return (
    <Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size={triggerSize as ButtonProps['size']}>
            Зураг сонгох
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[480px]">
            <div className="grid grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => handleSelectImage(img)}
                  className="group/hover-image relative aspect-[4/3] cursor-pointer overflow-hidden rounded-md bg-black"
                >
                  <Image
                    key={img.id}
                    src={img.image_url ?? ''}
                    alt={img.file_name}
                    fill
                    className="transition-color object-cover duration-300 group-hover/hover-image:opacity-50"
                  />

                  {selectedImage?.id === img.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex items-center justify-center rounded-full bg-black/80 p-2">
                        <CheckIcon className="size-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() => updateAction(selectedImage!)}
                disabled={!selectedImage}
              >
                Upload
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
