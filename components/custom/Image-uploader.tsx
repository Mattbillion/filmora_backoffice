'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadImage } from '@/lib/functions';

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  uploading: boolean;
};

export function MultiImageUpload({
  field,
  imagePrefix,
  label,
  disabled,
}: {
  field: ControllerRenderProps<any, any>;
  imagePrefix: string;
  label?: string;
  disabled?: boolean;
}) {
  const { clearErrors, setError } = useFormContext();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const value = images
        .filter((img) => img.uploadedUrl)
        .map((img) => ({
          url: img.uploadedUrl!,
          size: img.file.size,
          type: img.file.type,
          media_url: img.uploadedUrl!,
          media_type: img.file.type,
          media_label: img.file.name,
          media_desc: '',
        }));

      field.onChange(value);
    } else {
      isMounted.current = true;
    }
  }, [images]);

  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
  }, [images]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file) => {
        if (file.size > 5_000_000) {
          toast.error(`${file.name} зураг 5MB-аас том байна.`);
          return;
        }

        const id = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);

        const newImage: UploadedImage = {
          id,
          file,
          previewUrl,
          uploading: true,
        };

        setImages((prev) => [...prev, newImage]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('prefix', imagePrefix);

        try {
          const res = await uploadImage(formData);
          setImages((prev) =>
            prev.map((img) =>
              img.id === id
                ? { ...img, uploading: false, uploadedUrl: res?.data }
                : img,
            ),
          );
        } catch (err: any) {
          setError(field.name, { message: err.message }, { shouldFocus: true });
        }
      });
    },
    [field.name, imagePrefix, setError],
  );

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    disabled,
  });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-gray-400 p-6 text-center"
          >
            <input {...getInputProps()} />
            <p>Зургаа чирж оруулна уу эсвэл дарж сонгоно уу</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative overflow-hidden rounded border bg-slate-100"
                >
                  <Image
                    src={img.uploadedUrl || img.previewUrl}
                    alt={img.file.name}
                    className="h-32 w-full object-cover"
                    width={200}
                    height={200}
                  />
                  <div className="space-y-1 p-2 text-xs">
                    <p className="font-medium break-all">{img.file.name}</p>
                    <p>{(img.file.size / 1024).toFixed(1)} KB</p>
                    <p className="uppercase">{img.file.type}</p>
                  </div>

                  {img.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 size={24} className="animate-spin text-white" />
                    </div>
                  )}
                  {!img.uploading && (
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 rounded-full bg-white p-1 shadow"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
