'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StreamVideo } from '@/lib/cloudflare/type';
import { humanizeBytes } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permission';

const isTrailer = (video: StreamVideo) => {
  // If requireSignedURLs is false or undefined, it's a public trailer
  // If requireSignedURLs is true, it's a protected movie
  return !video.requireSignedURLs;
};

export function Client({ data }: { data: StreamVideo[] }) {
  const session = useSession();
  const [filter, setFilter] = useState<'all' | 'movie' | 'trailer'>('all');

  const trailers = data.filter((video) => isTrailer(video));
  const movies = data.filter((video) => !isTrailer(video));

  const filteredData = filter === 'trailer' 
    ? trailers 
    : filter === 'movie' 
    ? movies 
    : data;

  return (
    <div className="space-y-4">
      <div className="border-border flex items-center justify-between gap-10 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold">Нийт видео</h1>
            <span className="text-xl font-medium">({data.length})</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-3 text-sm">
            <span>Кино: {movies.length}</span>
            <span>•</span>
            <span>Trailer: {trailers.length}</span>
          </div>
        </div>
        {hasPermission(session.data, 'streams.upload', 'create') && (
          <Link
            href="/streams/upload"
            className="border-border h-10 rounded-lg border px-4 py-2 transition-all duration-200 hover:bg-black/90"
          >
            Видео оруулах
          </Link>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Бүгд
        </Button>
        <Button
          variant={filter === 'movie' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('movie')}
        >
          Кино ({movies.length})
        </Button>
        <Button
          variant={filter === 'trailer' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('trailer')}
        >
          Trailer ({trailers.length})
        </Button>
      </div>

      <div className="flex flex-col">
        {filteredData.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            Мэдээлэл олдсонгүй
          </div>
        ) : (
          filteredData.map((video) => {
            const trailer = isTrailer(video);
            return (
              <Link
                href={video.preview || '#'}
                key={video.uid}
                className="border-border border-b last:border-b-0 hover:bg-black/90"
              >
                <div className="flex justify-between gap-1 p-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h1 className="text-lg font-medium">{video.meta?.name}</h1>
                      {trailer && (
                        <Badge variant="secondary" className="h-fit w-fit">
                          Public
                        </Badge>
                      )}
                      {!trailer && (
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
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
