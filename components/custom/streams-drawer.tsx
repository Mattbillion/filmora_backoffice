'use client';

import {
  FormEvent,
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchStream } from '@/lib/cloudflare';
import { StreamSearchParams, StreamVideo } from '@/lib/cloudflare/type';
import { cn, formatDuration, humanizeBytes } from '@/lib/utils';

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
  onSelect?: (video: StreamVideo) => void;
  defaultFilter?: string;
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
      defaultFilter = '',
    },
    ref,
  ) => {
    const [open, setOpen] = useState<boolean>(initialOpen);
    const [videos, setVideos] = useState<StreamVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((s) => !s),
    }));

    const resetAndFetch = async (searchOverride?: string) => {
      setLoading(true);
      setError(null);
      setVideos([]);
      setNextCursor(undefined);
      setHasMore(false);

      const searchTerm =
        typeof searchOverride === 'string' ? searchOverride : filter;

      try {
        const params: StreamSearchParams = searchTerm
          ? { search: searchTerm }
          : {};
        const res = await fetchStream({ ...params } as any);
        setVideos(res.videos || []);
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
        if (filter) params.search = filter;
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
        let f = '';
        if (defaultFilter) {
          const [def] = defaultFilter.split(' ');
          f = def;
          if (def) setFilter(def);
        }
        resetAndFetch(f);
      }
    }, [open]);

    const onSubmitSearch = async (e?: FormEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      // trigger fetch with current filter
      await resetAndFetch(filter);
    };

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
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-lg">Кино видео сонгох</DrawerTitle>
              </div>

              <form onSubmit={onSubmitSearch} className="flex gap-2">
                <Input
                  placeholder="Search videos by name..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" disabled={loading}>
                  Search
                </Button>
                <Button
                  variant="ghost"
                  disabled={!filter}
                  onClick={() => {
                    setFilter('');
                    resetAndFetch('');
                  }}
                >
                  Clear
                </Button>
              </form>
            </div>
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
                  No videos found. Try adjusting your search.
                </div>
              )}

              {videos.map((video) => (
                <div
                  key={video.uid}
                  className="border-b-border/30 flex cursor-pointer items-center gap-4 border-b py-3 hover:bg-black/90"
                  onClick={() => {
                    onSelect?.(video);
                    setOpen(false);
                  }}
                >
                  <div className="bg-muted relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-md">
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
                    {video.duration != null && (
                      <span className="absolute right-0.5 bottom-0.5 rounded-sm bg-black/65 px-2 py-0.5 font-mono text-xs text-white">
                        {formatDuration(video.duration)}
                      </span>
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
                        {video.requireSignedURLs ? (
                          <Badge variant="secondary" className="h-fit w-fit">
                            Трейлер
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="h-fit w-fit">
                            Кино
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground text-right text-xs">
                        {video.size ? humanizeBytes(video.size) : '-'}
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
