'use client';

import { useState, useTransition } from 'react';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { fetchSignedToken, fetchStreamDetail } from '@/lib/cloudflare';
import { StreamVideo } from '@/lib/cloudflare/type';
import { humanizeBytes } from '@/lib/utils';

export default function StreamItem({ video }: { video: StreamVideo }) {
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const [cloudflareData, setCloudFlareData] = useState<StreamVideo>();
  const [cfPreview, setCfPreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isTrailer = !video.requireSignedURLs;

  const loadDetail = () => {
    if (cloudflareData || loading) return;

    startTransition(() => {
      Promise.allSettled([
        fetchStreamDetail(video.uid),
        fetchSignedToken(video.uid),
      ]).then((results) => {
        const [detailRes, tokenRes] = results;

        if (detailRes.status === 'fulfilled') {
          setCloudFlareData(detailRes.value.video);
        } else {
          setError('Failed to fetch stream detail:' + detailRes.reason);
        }

        if (tokenRes.status === 'fulfilled') {
          setCfPreview(tokenRes.value);
        } else {
          setError('Failed to fetch signed token:' + tokenRes.reason);
        }
      });
    });
  };

  return (
    <AccordionItem
      value={video.uid}
      className="[&[data-state=open]]:bg-secondary/15 px-2"
    >
      <AccordionTrigger
        hideChevron
        onClick={() => {
          const willOpen = !open;
          setOpen(willOpen);
          if (willOpen) loadDetail();
        }}
      >
        <div className="flex w-full justify-between gap-1">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-lg font-medium">{video.meta?.name}</h1>
              {isTrailer ? (
                <Badge variant="secondary" className="h-fit w-fit">
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="h-fit w-fit">
                  Protected
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground">
              {dayjs(video.uploaded).format('YYYY/MM/DD')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            {video.readyToStream && (
              <Badge variant="outline" className="flex h-fit w-fit gap-1">
                <div className="size-2.5 rounded-full bg-green-600" />
                Ready to stream
              </Badge>
            )}

            <p className="text-muted-foreground">
              {video.size && humanizeBytes(video.size)}
            </p>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : error ? (
          <div className="text-destructive text-center text-sm">{error}</div>
        ) : (
          <div className="space-y-2 py-2">
            {cloudflareData && cfPreview && (
              <div className="bg-background relative aspect-video overflow-hidden rounded-md">
                <iframe
                  src={`${cloudflareData?.preview?.match(/^(https:\/\/[^/]+)/)?.[1]}/${cfPreview}/iframe?poster=${cloudflareData?.thumbnail}`}
                  height="720"
                  width="1280"
                  className="h-full w-full object-contain"
                  allowFullScreen={false}
                />
              </div>
            )}

            {cloudflareData ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">uid:</span>
                  <span>{cloudflareData.uid}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">status:</span>
                  <span>{cloudflareData.status?.state || 'unknown'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">duration:</span>
                  <span>
                    {Math.floor(cloudflareData.duration / 60)}m{' '}
                    {cloudflareData.duration % 60}s
                  </span>
                </div>

                {cloudflareData.size && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">size:</span>
                    <span>{humanizeBytes(cloudflareData.size)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="font-medium">created:</span>
                  <span>
                    {dayjs(cloudflareData.created).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                No details loaded.
              </div>
            )}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
