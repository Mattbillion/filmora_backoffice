'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Clapperboard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchSignedToken, fetchStreamDetail } from '@/lib/cloudflare';
import { StreamVideo } from '@/lib/cloudflare/type';
import { humanizeBytes } from '@/lib/utils';

export default function VideoPreview({ cfId }: { cfId?: string }) {
  const [cloudflareData, setCloudFlareData] = useState<StreamVideo>();
  const [cfPreview, setCfPreview] = useState<string>('');

  useEffect(() => {
    if (cfId) {
      fetchStreamDetail(cfId).then((cc) => setCloudFlareData(cc.video));
      fetchSignedToken(cfId).then(setCfPreview);
    }
  }, [cfId]);

  return (
    <>
      <div className="relative aspect-video overflow-hidden rounded-md">
        {cfPreview ? (
          <iframe
            src={`${cloudflareData?.preview?.match(/^(https:\/\/[^/]+)/)?.[1]}/${cfPreview}/iframe?poster=${cloudflareData?.thumbnail}`}
            height="720"
            width="1280"
            className="h-full w-full object-contain"
            allowFullScreen={false}
          />
        ) : (
          <div className="bg-background flex h-full flex-col items-center justify-center gap-6">
            <span className="text-muted-foreground">
              {cfId || cloudflareData
                ? 'Видео урьдчилсан үзэлт бэлэн болоогүй байна.'
                : 'Видео мэдээлэл байхгүй байна.'}
            </span>
            {!cfId && !cloudflareData && (
              <Button variant="secondary">
                <Clapperboard /> Видео сонгох
              </Button>
            )}
          </div>
        )}
      </div>
      {(cfId || cloudflareData) && (
        <Button
          className="!bg-background !text-foreground w-full cursor-pointer"
          size="lg"
        >
          <Clapperboard /> Видео сонгох
        </Button>
      )}
      {cloudflareData && (
        <div className="bg-background space-y-1 rounded-md p-4">
          <h3 className="text-lg font-semibold">Stream Information</h3>

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
              {dayjs(cloudflareData.created).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </div>

          {cloudflareData.modified && (
            <div className="flex items-center gap-2">
              <span className="font-medium">modified:</span>
              <span>
                {dayjs(cloudflareData.modified).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
          )}

          {cloudflareData.uploaded && (
            <div className="flex items-center gap-2">
              <span className="font-medium">uploaded:</span>
              <span>
                {dayjs(cloudflareData.uploaded).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-medium">ready to stream:</span>
            {cloudflareData.readyToStream ? (
              <Badge variant="secondary">Ready</Badge>
            ) : (
              <Badge variant="destructive" className="bg-destructive/50">
                {cloudflareData.status?.pctComplete || 'Not ready'}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">signed urls:</span>
            {cloudflareData.requireSignedURLs ? (
              <Badge variant="destructive" className="bg-destructive/50">
                Required
              </Badge>
            ) : (
              <Badge variant="secondary">Not required</Badge>
            )}
          </div>

          {cloudflareData.maxDurationSeconds && (
            <div className="flex items-center gap-2">
              <span className="font-medium">max duration:</span>
              <span>{cloudflareData.maxDurationSeconds}s</span>
            </div>
          )}

          {cloudflareData.watermark && (
            <div className="flex items-center gap-2">
              <span className="font-medium">watermark:</span>
              <span>{cloudflareData.watermark.name}</span>
            </div>
          )}

          {cloudflareData.meta && (
            <div className="flex items-start gap-2">
              <span className="font-medium">metadata:</span>
              <span>{JSON.stringify(cloudflareData.meta)}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
