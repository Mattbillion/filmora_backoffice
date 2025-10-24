'use client';

import dayjs from 'dayjs';
import { FilmIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { StreamVideo } from '@/lib/cloudflare/type';
import { humanizeBytes } from '@/lib/utils';

export function Client({ data }: { data: StreamVideo[] }) {
  return (
    <div className="space-y-4">
      <div className="border-border flex items-center justify-between gap-10 border-b pb-4">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-bold">Нийт оруулсан кино</h1>
          <span className="text-xl font-medium">({data.length})</span>
        </div>
        <Link
          href="/streams/upload"
          className="border-border flex h-10 items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors duration-200 hover:bg-black/90"
        >
          <FilmIcon className="h-5" />
          Upload Movie
        </Link>
      </div>
      <div className="flex flex-col">
        {data.map((video) => (
          <Link
            href={video.preview || '#'}
            key={video.uid}
            className="border-border border-b last:border-b-0 hover:bg-black/90"
          >
            <div className="flex justify-between gap-1 p-4">
              <div>
                <h1 className="text-lg font-medium">{video.meta?.name}</h1>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
