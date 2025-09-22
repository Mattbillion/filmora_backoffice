'use client';

import { useCallback, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { uploadMedia } from '@/services/media/service';
import { type MoviesItemType } from '@/services/movies/schema';
import { updateMovie } from '@/services/movies/service';
import { ImageInfoType } from '@/services/schema';

import { MediaDialog } from './media-dialog';

export function UploadCover({
  id,
  initialData,
}: {
  id: string;
  initialData: MoviesItemType;
}) {
  const [preview, setPreview] = useState(initialData.load_image_url ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateMovieWithNewCover = async (imageUrl: string) => {
    const payload = {
      title: initialData.title,
      description: initialData.description,
      type: initialData.type,
      year: Number(initialData.year),
      price: Number(initialData.price),
      is_premium: initialData.is_premium,
      is_adult: initialData.is_adult,
      poster_url: initialData.poster_url,
      load_image_url: imageUrl, //Setting new cover
      categories: initialData.categories.map((c) => c.id),
      genres: initialData.genres.map((g) => g.id),
    };
    return updateMovie(id, payload);
  };

  const getSelectedImage = async (image: ImageInfoType) => {
    setIsUploading(true);
    setPreview(image.image_url);
    updateMovieWithNewCover(image.image_url).finally(() => {
      setIsUploading(false);
      toast.success('Зургийг амжилттай орууллаа!');
    });
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        console.error('Not an image file');
        return;
      }
      if (file.size > 5_000_000) {
        console.error('File too large (max 5MB)');
        return;
      }

      try {
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('prefix', 'movies');

        const { body } = await uploadMedia(formData);
        if (body.status !== 'success') throw new Error(body.message);

        const imageUrl = body.data.images.original;

        setPreview(imageUrl);

        await updateMovieWithNewCover(imageUrl);
        toast.success('Зургийг амжилттай орууллаа!');
      } catch (err) {
        toast.error('Зургийг оруулахад алдаа гарлаа!');
      } finally {
        setIsUploading(false);
      }
    },
    [id, initialData],
  );

  return (
    <div className="w-full">
      <h1 className="text-lg font-medium">Movie cover</h1>
      <div className="relative aspect-[4/2] overflow-hidden rounded-xl bg-black">
        <Image
          src={preview || '/placeholder-image.jpg'}
          alt="Movie cover"
          fill
          className="object-cover"
          unoptimized
        />

        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            Upload Cover
          </Button>
          <MediaDialog updateAction={getSelectedImage} />
        </div>

        {/* Loader overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            e.currentTarget.value = '';
            handleFileSelect(file);
          }
        }}
      />
    </div>
  );
}
