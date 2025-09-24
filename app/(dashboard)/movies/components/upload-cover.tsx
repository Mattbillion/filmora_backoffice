'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { FormControl, FormItem } from '@/components/ui/form';
import { uploadMedia } from '@/services/media/service';
import { ImageInfoType } from '@/services/schema';

import { MediaDialog } from '../[id]/media-dialog';

export function UploadCover({ field }: { field: FieldValues }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(field.value || null);
  }, [field.value]);

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prefix', 'movies');

      const { body } = await uploadMedia(formData);
      const newImageUrl = body.data.images.original;

      setPreviewUrl(newImageUrl);
      onFieldChange(newImageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const onFieldChange = async (imageUrl: string) => {
    await field.onChange(imageUrl);
    return imageUrl;
  };

  const handleUploadImage = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', 'movies');
    try {
      const { body } = await uploadMedia(formData);
      const imageUrl = body.data.images.original;

      setPreviewUrl(imageUrl);
      onFieldChange(imageUrl);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const getSelectedImage = async (image: ImageInfoType) => {
    setPreviewUrl(image.image_url);
    onFieldChange(image.image_url);
  };

  return (
    <FormItem>
      <div className="relative h-[360px] w-full overflow-hidden rounded-xl bg-black">
        {isUploading ? (
          <div
            className="absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black/80"
            onClick={() => inputRef.current?.click()}
          >
            <Loader2 className="size-10 animate-spin items-center justify-center" />
            <p className="text-center">Уншиж байна...</p>
          </div>
        ) : (
          <div
            className="text-muted-foreground transition-color flex h-full w-full cursor-pointer items-center justify-center gap-2 bg-gray-200/10 duration-300 hover:bg-gray-200/15"
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <ImagePlus size={20} />
              <p className="text-center">
                Энд дарж ковер зургаа оруулна уу? <br /> (png, jpg, jpeg, webp,
                svg)
              </p>
            </div>
          </div>
        )}

        {!!previewUrl && (
          <>
            <Image
              src={previewUrl}
              alt="cover background"
              fill
              className="object-cover blur-xl"
            />
            <Image
              src={previewUrl}
              alt="cover"
              fill
              className="object-contain"
              onClick={() => inputRef.current?.click()}
            />
          </>
        )}

        <div className="absolute bottom-4 left-4 flex gap-2">
          <MediaDialog updateAction={getSelectedImage} triggerSize="default" />
        </div>
      </div>
      <FormControl>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          ref={inputRef}
          onChange={(e) => handleUploadImage(e.target.files?.[0]!)}
        />
      </FormControl>
    </FormItem>
  );
}
