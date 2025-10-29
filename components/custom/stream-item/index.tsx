'use client';

import { useState, useTransition } from 'react';
import { kebabCase } from 'change-case-all';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchStreamDetail } from '@/lib/cloudflare';
import { StreamVideo } from '@/lib/cloudflare/type';
import { humanizeBytes, splitByVideoExt } from '@/lib/utils';

import { CaptionsTab } from './captions-tab';
import { InfoTab } from './info-tab';
import { PreviewTab } from './preview-tab';

export default function StreamItem({ video }: { video: StreamVideo }) {
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const [cloudflareData, setCloudFlareData] = useState<StreamVideo>();
  const [error, setError] = useState<string | null>(null);

  const isTrailer = !video.requireSignedURLs;

  const loadDetail = () => {
    if (cloudflareData || loading) return;

    startTransition(() => {
      fetchStreamDetail(video.uid)
        .then((res) => setCloudFlareData(res.video))
        .catch((e) => setError(e?.message || String(e)));
    });
  };

  return (
    <AccordionItem value={video.uid} className="px-2">
      <AccordionTrigger
        hideChevron
        onClick={() => {
          const willOpen = !open;
          setOpen(willOpen);
          if (willOpen) loadDetail();
        }}
      >
        <div className="flex w-full cursor-pointer justify-between gap-1">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-lg font-medium">{video.meta?.name}</h1>
              {isTrailer ? (
                <Badge variant="secondary" className="h-fit w-fit">
                  Трейлер
                </Badge>
              ) : (
                <Badge variant="outline" className="h-fit w-fit">
                  Кино
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
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Stream Info</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="captions">Captions</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="bg-muted rounded-lg p-2">
                <InfoTab
                  data={cloudflareData}
                  onUpdate={(v) =>
                    setCloudFlareData((prev) => ({ ...prev, ...v }))
                  }
                />
              </TabsContent>

              <TabsContent value="preview" className="bg-muted rounded-lg p-2">
                <PreviewTab video={cloudflareData} />
              </TabsContent>

              <TabsContent value="captions" className="bg-muted rounded-lg p-2">
                <CaptionsTab
                  streamId={cloudflareData?.uid}
                  videoName={kebabCase(
                    splitByVideoExt(cloudflareData?.meta?.name || '').base ||
                      `stream-${cloudflareData?.uid}`,
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
