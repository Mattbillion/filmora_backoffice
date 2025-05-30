'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { getCroppedImg } from '@/lib/crop-image';
import { uploadImage } from '@/lib/functions';

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  uploading: boolean;
};

export function BannerUpload({
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
  const { setError } = useFormContext();
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    return () => {
      if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
      if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl);
    };
  }, [rawImageUrl, image]);

  useEffect(() => {
    if (isMounted.current && image?.uploadedUrl) {
      const value = {
        url: image.uploadedUrl,
        size: image.file.size,
        type: image.file.type,
        media_url: image.uploadedUrl,
        media_type: image.file.type,
        media_label: image.file.name,
        media_desc: '',
      };

      // Update form field but avoid triggering submission
      field.onChange(value.url);
    } else {
      isMounted.current = true;
    }
  }, [image]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5_000_000) {
      toast.error(`${file.name} зураг 5MB-аас том байна.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setRawImageUrl(previewUrl);
    setShowCrop(true);
  }, []);

  const cropComplete = useCallback((_: any, croppedAreaPixelsProp: any) => {
    setCroppedAreaPixels(croppedAreaPixelsProp);
  }, []);

  const cropAndUpload = async () => {
    if (!rawImageUrl || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(rawImageUrl, croppedAreaPixels);
      const file = new File([croppedBlob], 'cropped.jpeg', {
        type: 'image/jpeg',
      });

      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      const newImage: UploadedImage = {
        id,
        file,
        previewUrl,
        uploading: true,
      };

      setImage(newImage);
      setShowCrop(false);
      setRawImageUrl(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('prefix', imagePrefix);

      const res = await uploadImage(formData);

      setImage((prev) =>
        prev ? { ...prev, uploading: false, uploadedUrl: res?.data } : prev,
      );
    } catch (err: any) {
      setError(field.name, { message: err.message }, { shouldFocus: true });
    }
  };

  const removeImage = () => {
    setImage(null);
    field.onChange(undefined); // clear field without triggering submit
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: disabled || image?.uploading,
  });

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div
          {...getRootProps()}
          className="relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-gray-50 p-6 text-center"
        >
          <input {...getInputProps()} />
          {image ? (
            <>
              <Image
                src={image.uploadedUrl || image.previewUrl}
                alt={image.file.name}
                className="absolute inset-0 h-full w-full object-cover"
                fill
              />
              {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 size={24} className="animate-spin text-white" />
                </div>
              )}
              {!image.uploading && (
                <Button
                  variant="secondary"
                  type="button"
                  size="icon"
                  onClick={removeImage}
                  className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </Button>
              )}
            </>
          ) : (
            <p className="text-gray-500">
              Зургаа чирж оруулна уу эсвэл дарж сонгоно уу
            </p>
          )}
        </div>
      </FormControl>
      <FormMessage />

      {showCrop && rawImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[90vw] max-w-xl rounded-lg bg-white p-4">
            <div className="relative h-80 w-full bg-black">
              <Cropper
                image={rawImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={5 / 2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={cropComplete}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setShowCrop(false);
                  setRawImageUrl(null);
                }}
                aria-label="Cancel cropping"
              >
                Цуцлах
              </Button>
              <Button
                variant="default"
                type="button"
                onClick={cropAndUpload}
                aria-label="Save cropped image"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </div>
      )}
    </FormItem>
  );
}
