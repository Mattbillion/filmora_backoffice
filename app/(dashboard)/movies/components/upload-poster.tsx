'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { FormControl, FormItem } from '@/components/ui/form';
import { uploadMedia } from '@/services/media/service';
import { ImageInfoType } from '@/services/schema';

import { MediaDialog } from '../[id]/media-dialog';

export function UploadPoster({ field }: { field: FieldValues }) {
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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', 'movies');
    try {
      setIsUploading(true);
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
    <FormItem className="border-border flex w-full items-center justify-between gap-4 rounded-lg border p-4 pl-6">
      <div className="flex w-full max-w-[450px] flex-col items-start justify-start gap-2">
        <h1 className="font-medium">Постер зураг оруулна уу</h1>
        <p className="text-muted-foreground mb-2">
          Энд дарж ковер зургаа оруулна уу?{' '}
          <span className="font-bold">(png, jpg, jpeg, webp)</span> форматтай
          зураг оруулна уу
        </p>
        <MediaDialog updateAction={getSelectedImage} triggerSize="lg" />
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

      <div
        className="relative aspect-[3/4] h-full w-[156px] overflow-hidden rounded-lg bg-black"
        onClick={() => inputRef.current?.click()}
      >
        {isUploading && (
          <div
            className="absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black/80"
            onClick={() => inputRef.current?.click()}
          >
            <Loader2 className="size-6 animate-spin items-center justify-center" />
          </div>
        )}

        {!!previewUrl && (
          <>
            <Image
              src={previewUrl}
              alt="cover background"
              fill
              className="object-cover blur-sm"
            />
            <Image
              src={previewUrl || ''}
              alt="cover"
              fill
              className="object-contain"
            />
          </>
        )}
        <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 bg-gray-500/20 p-2 text-center text-sm">
          <ImageIcon size={24} />
          Постер зураг оруулна уу
        </div>
      </div>
    </FormItem>
  );
}
