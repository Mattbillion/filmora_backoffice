'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { objToFormData } from '@/lib/utils';
import { uploadMedia } from '@/services/media/service';

import { MediaDialog } from '../[id]/media-dialog';

export function UploadCover({ field }: { field: FieldValues }) {
  const { clearErrors, setError } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUploading] = useTransition();

  useEffect(() => {
    setPreviewUrl(field.value || null);
  }, [field.value]);

  const handleFieldChange = (imageUrl: string) => {
    clearErrors(field.name);
    field.onChange(imageUrl);
    setPreviewUrl(imageUrl);
  };

  return (
    <FormItem>
      <div className="relative h-[360px] w-full overflow-hidden rounded-xl bg-black">
        {uploading ? (
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
          <MediaDialog
            updateAction={(image) => handleFieldChange(image.image_url)}
          />
        </div>
      </div>
      <FormControl>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          ref={inputRef}
          disabled={uploading}
          onChange={(e) => {
            const [file] = e.target.files || [];
            if (!file) return;

            startUploading(() => {
              uploadMedia(objToFormData({ file }))
                .then((result) =>
                  handleFieldChange(result.body.data.images.original),
                )
                .catch((error) => {
                  toast.error(error.message);
                  setError(
                    field.name,
                    { message: error.message },
                    { shouldFocus: true },
                  );
                })
                .finally(() => {
                  if (inputRef.current) inputRef.current.value = '';
                });
            });
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
