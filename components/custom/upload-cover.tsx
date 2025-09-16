'use client';

import { useState } from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadImage } from '@/lib/functions';
import { extractActionError, imageResize, isPath, isUri } from '@/lib/utils';

import { Input } from '../ui/input';
import { MediaDialog } from './media-dialog';

export default function UploadImageItem({
  field,
  imagePrefix,
  label,
  disabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  imagePrefix: string;
  label?: string;
  disabled?: boolean;
}) {
  const { clearErrors, setError } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>();
  const validImage =
    !!field.value && (isPath(field.value) || isUri(field.value));

  const currentUrl = preview || imageResize(field.value, 'small');

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="group/hover relative">
          {!!(preview || validImage) && (
            <div className="relative h-[400px] overflow-hidden rounded-2xl">
              {/* Blurred background */}
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-70 blur-md"
                style={{ backgroundImage: `url("${currentUrl}")` }}
                aria-hidden
              />

              <div className="absolute inset-0 bg-black/50" aria-hidden />

              <Image
                src={currentUrl}
                alt={`${label ?? 'Image'} preview`}
                fill
                className="relative z-10 object-contain"
                unoptimized
              />

              {loading && (
                <div className="absolute inset-0 z-20 grid place-items-center bg-black/30">
                  <Loader2 size={24} color="white" className="animate-spin" />
                </div>
              )}
            </div>
          )}

          <div className="absolute top-0 bottom-0 z-10 my-auto h-fit w-full px-[30%]">
            <div className="flex w-full items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                disabled={loading || disabled}
                className="bg-background flex h-9 overflow-hidden px-4 py-2"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    if (file?.size >= 5000000)
                      return setError(
                        field.name,
                        { message: 'Зургийн хэмжээ том байна.' },
                        { shouldFocus: true },
                      );

                    setLoading(true);
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setPreview(reader.result as string);
                    reader.readAsDataURL(file);

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('prefix', imagePrefix);

                    uploadImage(formData)
                      .then((c) => {
                        field.onChange(c?.data);
                        clearErrors(field.name);
                      })
                      .catch((err) => {
                        const { message } = extractActionError(err);
                        setError(
                          field.name,
                          { message },
                          { shouldFocus: true },
                        );
                      })
                      .finally(() => setLoading(false));
                  }
                }}
              />
              <MediaDialog />
            </div>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
