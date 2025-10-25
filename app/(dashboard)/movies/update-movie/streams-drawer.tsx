'use client';

import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchStream } from '@/lib/cloudflare';
import { StreamSearchParams, StreamVideo } from '@/lib/cloudflare/type';
import { cn, humanizeBytes } from '@/lib/utils';

export interface StreamsDrawerRef {
  open: () => void;
  close: () => void;
  toggle?: () => void;
}

interface StreamsDrawerProps {
  trigger?: ReactNode;
  className?: string;
  footer?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  initialOpen?: boolean;
  onSelect?: (video: StreamVideo) => void; // called when user selects a stream
  pageSize?: number;
}

const StreamsDrawer = forwardRef<StreamsDrawerRef, StreamsDrawerProps>(
  (
    {
      trigger,
      className,
      footer,
      onOpenChange,
      initialOpen = false,
      onSelect,
      pageSize = 20,
    },
    ref,
  ) => {
    const [open, setOpen] = useState<boolean>(initialOpen);
    const [videos, setVideos] = useState<StreamVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((s) => !s),
    }));

    const resetAndFetch = async () => {
      setLoading(true);
      setError(null);
      setVideos([]);
      setNextCursor(undefined);
      setHasMore(false);

      try {
        const params: StreamSearchParams = {
          /* initial params if needed */
        };
        const res = await fetchStream({
          ...params /* pageSize not part of type, keep default */,
        } as any);
        setVideos(res.videos || []);
        console.log(res.videos || []);
        setNextCursor(res.nextCursor);
        setHasMore(!!res.hasMore);
      } catch (err: any) {
        console.error('Failed to fetch streams', err);
        setError(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    };

    const loadMore = async () => {
      if (!nextCursor) return;
      setLoading(true);
      setError(null);
      try {
        const params: StreamSearchParams = { before: nextCursor };
        const res = await fetchStream(params as any);
        setVideos((prev) => [...prev, ...(res.videos || [])]);
        setNextCursor(res.nextCursor);
        setHasMore(!!res.hasMore);
      } catch (err: any) {
        console.error('Failed to fetch more streams', err);
        setError(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (open) {
        resetAndFetch();
      }
    }, [open]);

    return (
      <Drawer
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          onOpenChange?.(v);
        }}
      >
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

        <DrawerContent className={cn('h-[90vh]', className)}>
          <DrawerHeader className="bg-background p-4">
            <DrawerTitle className="text-lg">Кино видео сонгох</DrawerTitle>
          </DrawerHeader>

          <div className="mx-auto min-h-0 max-w-[900px] flex-1 space-y-4 pt-4 pb-4">
            <ScrollArea className="h-full space-y-2 overflow-y-auto">
              {loading && videos.length === 0 && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="animate-spin" />
                </div>
              )}

              {error && <div className="text-destructive p-4">{error}</div>}

              {!loading && videos.length === 0 && !error && (
                <div className="text-muted-foreground p-4">
                  No videos found.
                </div>
              )}

              {videos.map((video) => (
                <div
                  key={video.uid}
                  className="flex cursor-pointer items-center gap-4 border-b px-4 py-3 hover:bg-black/90"
                  onClick={() => {
                    onSelect?.(video);
                    setOpen(false);
                  }}
                >
                  <div className="bg-muted h-20 w-36 flex-shrink-0 overflow-hidden rounded-md">
                    {/* thumbnail or preview */}
                    {video.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnail}
                        alt={video.meta?.name || video.uid}
                        className="h-full w-full object-cover"
                      />
                    ) : video.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.preview}
                        alt={video.meta?.name || video.uid}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                        No thumbnail
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium">
                        {video.meta?.name || video.uid}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {video.uploaded
                          ? dayjs(video.uploaded).format('YYYY/MM/DD')
                          : dayjs(video.created).format('YYYY/MM/DD')}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {video.readyToStream ? (
                          <Badge variant="outline">Ready</Badge>
                        ) : (
                          <Badge variant="destructive">
                            {video.status?.pctComplete || 'Not ready'}
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground text-right text-xs">
                        <div>
                          {typeof video.duration === 'number' && (
                            <span>
                              {Math.floor(video.duration / 60)}m{' '}
                              {video.duration % 60}s
                            </span>
                          )}
                        </div>
                        <div>{video.size ? humanizeBytes(video.size) : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="flex items-center justify-center py-4">
                  <Button onClick={loadMore} disabled={loading}>
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </ScrollArea>

            {footer && (
              <DrawerFooter className="px-4 pt-4">{footer}</DrawerFooter>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
);

StreamsDrawer.displayName = 'StreamsDrawer';

export default StreamsDrawer;
