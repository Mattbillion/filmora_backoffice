'use client';

import { useState } from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadImage } from '@/lib/functions';
import { apiImage, extractActionError, isPath, isUri } from '@/lib/utils';

import { Input } from '../ui/input';

export default function UploadImageItem({
  field,
  imagePrefix,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  imagePrefix: string;
  label: string;
}) {
  const { clearErrors, setError } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>();
  const validImage =
    !!field.value && (isPath(field.value) || isUri(field.value));

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center gap-2">
          {!!(preview || validImage) && (
            <picture className="relative aspect-video h-11 overflow-hidden rounded-md">
              <img
                src={preview || apiImage(field.value, 'xs')}
                alt={`${label} preview`}
                className="h-full w-full object-cover"
              />
              {loading && (
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/30">
                  <Loader2 size={24} color="white" className="animate-spin" />
                </div>
              )}
            </picture>
          )}
          <Input
            type="file"
            accept="image/*"
            disabled={loading}
            className="block content-center"
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
                reader.onloadend = () => setPreview(reader.result as string);
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
                    setError(field.name, { message }, { shouldFocus: true });
                  })
                  .finally(() => setLoading(false));
              }
            }}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
