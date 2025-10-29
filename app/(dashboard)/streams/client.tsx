'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import StreamItem from '@/components/custom/stream-item';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { StreamVideo } from '@/lib/cloudflare/type';
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

  const filteredData =
    filter === 'trailer' ? trailers : filter === 'movie' ? movies : data;

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
            return (
              <Accordion
                type="multiple"
                className="w-full cursor-pointer hover:bg-black/90"
                key={video.uid}
              >
                <StreamItem video={video} />
              </Accordion>
            );
          })
        )}
      </div>
    </div>
  );
}
