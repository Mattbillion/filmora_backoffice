'use client';

import { useEffect, useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';

import { fetchSignedToken } from '@/lib/cloudflare';
import { StreamVideo } from '@/lib/cloudflare/type';

export function PreviewTab({ video }: { video?: StreamVideo }) {
  const [cfPreview, setCfPreview] = useState<string>('');
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    if (video) {
      startLoading(() => {
        fetchSignedToken(video.uid).then((c) => setCfPreview(c));
      });
    }
  }, [video]);

  if (!video)
    return (
      <div className="bg-background relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-md">
        No preview available.
      </div>
    );

  if (loading)
    return (
      <div className="bg-background relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-md">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="bg-background relative aspect-video overflow-hidden rounded-md">
      {cfPreview ? (
        <iframe
          src={`${video.preview?.match(/^(https:\/\/[^/]+)/)?.[1]}/${cfPreview}/iframe?poster=${video.thumbnail}`}
          height="720"
          width="1280"
          className="h-full w-full object-contain"
          allowFullScreen={false}
        />
      ) : (
        <div className="text-muted-foreground py-4 text-sm">
          No preview available.
        </div>
      )}
    </div>
  );
}
