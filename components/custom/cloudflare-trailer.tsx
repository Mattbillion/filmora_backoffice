'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import dayjs from 'dayjs';

import StreamsDrawer, {
  StreamsDrawerRef,
} from '@/components/custom/streams-drawer';
import { Button } from '@/components/ui/button';
import { fetchStreamDetail } from '@/lib/cloudflare';
import { StreamVideo } from '@/lib/cloudflare/type';
import { formatDuration, humanizeBytes } from '@/lib/utils';

function extractCloudflareStreamId(hlsUrl?: string) {
  const regex =
    /https:\/\/customer-[^/]+\.cloudflarestream\.com\/([^/]+)\/manifest\/video\.(?:m3u8|hls)/;
  const match = hlsUrl?.match(regex);

  return match ? match[1] : null;
}

export default function CloudflareTrailer({
  hlsUrl,
  onChange,
}: {
  hlsUrl?: string;
  onChange?: (video: StreamVideo) => void;
}) {
  const streamId = extractCloudflareStreamId(hlsUrl);
  const streamsDrawerRef = useRef<StreamsDrawerRef>(null);
  const [cloudflareData, setCloudFlareData] = useState<StreamVideo>();
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    if (streamId) {
      startLoading(() => {
        fetchStreamDetail(streamId).then((c) => setCloudFlareData(c.video));
      });
    }
  }, [hlsUrl]);

  if (loading)
    return (
      <div className="flex animate-pulse cursor-pointer items-center gap-4">
        <div className="bg-muted relative flex h-20 w-36 flex-shrink-0 items-center justify-center overflow-hidden rounded-md" />
        <div className="flex-1 space-y-1">
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
          <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
        </div>
        <Button variant="secondary" type="button" disabled>
          Видео сонгох
        </Button>
      </div>
    );
  if (!cloudflareData)
    return (
      <div className="flex cursor-pointer items-center gap-4">
        <div className="flex-1">Trailer видеог оруулаагүй байна.</div>
        <Button
          variant="secondary"
          type="button"
          onClick={() => streamsDrawerRef.current?.open?.()}
        >
          Видео сонгох
        </Button>
      </div>
    );
  return (
    <>
      <StreamsDrawer
        ref={streamsDrawerRef}
        defaultFilter="trailer"
        onSelect={(video) => onChange?.(video)}
      />
      <div className="flex cursor-pointer items-center gap-4">
        <div className="bg-muted relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-md">
          <img src={cloudflareData?.thumbnail + '?time=5s'} alt="" />
          {cloudflareData?.duration != null && (
            <span className="absolute right-0.5 bottom-0.5 rounded-sm bg-black/65 px-2 py-0.5 font-mono text-xs text-white">
              {formatDuration(cloudflareData?.duration)}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-medium">
            {cloudflareData?.meta?.name || cloudflareData?.uid}
          </h4>
          <p className="text-muted-foreground text-xs">
            {cloudflareData?.uploaded
              ? dayjs(cloudflareData?.uploaded).format('YYYY/MM/DD')
              : dayjs(cloudflareData?.created).format('YYYY/MM/DD')}
          </p>
          <div className="text-muted-foreground text-xs">
            {cloudflareData?.size ? humanizeBytes(cloudflareData?.size) : '-'}
          </div>
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={() => streamsDrawerRef.current?.open?.()}
        >
          Видео сонгох
        </Button>
      </div>
    </>
  );
}
