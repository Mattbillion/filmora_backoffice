'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { imageResize, objToFormData } from '@/lib/utils';
import { uploadMedia } from '@/services/media/service';

import { MediaDialog } from '../[id]/media-dialog';

export function UploadPoster({
  field,
  className,
}: {
  field: FieldValues;
  className?: string;
}) {
  const { clearErrors, setError } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(field.value || null);
  }, [field.value]);

  const handleFieldChange = (imageUrl: string) => {
    clearErrors(field.name);
    field.onChange(imageUrl);
    setPreviewUrl(imageUrl);
  };

  return (
    <FormItem className={className}>
      <div className="border-border flex w-full items-center justify-between gap-4 rounded-lg border p-4 pl-6">
        <div className="flex w-full max-w-[450px] flex-col items-start justify-start gap-2">
          <h1 className="font-medium">Постер зураг оруулна уу</h1>
          <p className="text-muted-foreground mb-2">
            Энд дарж ковер зургаа оруулна уу?{' '}
            <span className="font-bold">(png, jpg, jpeg, webp)</span> форматтай
            зураг оруулна уу
          </p>
          <MediaDialog
            updateAction={(image) => handleFieldChange(image.image_url)}
            triggerSize="lg"
          />
        </div>

        <FormControl>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            ref={inputRef}
            onChange={(e) => {
              const [file] = e.target.files || [];
              if (!file) return;

              setIsUploading(true);
              uploadMedia(objToFormData({ file }))
                .then((result) =>
                  handleFieldChange(result.body.data.images.original),
                )
                .catch((error) => {
                  toast.error(error.message);
                  setError(
                    field.name,
                    {
                      message: error.message || 'Зураг оруулахад алдаа гарлаа.',
                    },
                    { shouldFocus: true },
                  );
                })
                .finally(() => {
                  setIsUploading(false);
                  if (inputRef.current) inputRef.current.value = '';
                });
            }}
          />
        </FormControl>

        <div
          className="relative aspect-[3/4] h-full w-[156px] overflow-hidden rounded-lg bg-black"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading && (
            <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black/80">
              <Loader2 className="size-6 animate-spin items-center justify-center" />
            </div>
          )}

          {!!previewUrl && (
            <>
              <Image
                src={imageResize(previewUrl, 'tiny')}
                alt="cover background"
                fill
                className="object-cover blur-sm"
              />
              <Image
                src={imageResize(previewUrl, 'tiny')}
                alt="cover"
                fill
                className="object-contain"
              />
            </>
          )}
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 bg-gray-500/20 p-2 text-center text-sm duration-300 hover:bg-gray-500/15">
            <ImageIcon size={24} />
            Постер зураг оруулна уу
          </div>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}
