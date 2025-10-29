'use client';

import { FormEvent, useEffect, useState, useTransition } from 'react';
import { handleCopy } from '@interpriz/lib';
import dayjs from 'dayjs';
import { Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  fetchSignedToken,
  fetchStreamDetail,
  updateStream,
} from '@/lib/cloudflare';
import { StreamVideo } from '@/lib/cloudflare/type';
import { cn, humanizeBytes } from '@/lib/utils';

function splitByVideoExt(input: string) {
  const re = /^(.*?)(\.(mp4|webm|mkv|mov|avi|flv|wmv|m4v|ts|m2ts|3gp|ogv))?$/i;
  const m = input.match(re);

  if (!m) return { base: input, extension: null as string | null };

  const base = m[1];
  const extension = m[3] ? m[3].toLowerCase() : null;

  return { base, extension };
}

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
                <CaptionsTab />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function InfoTab({
  data,
  onUpdate,
}: {
  data?: StreamVideo;
  onUpdate?: (v: StreamVideo) => void;
}) {
  const { base, extension } = splitByVideoExt(data?.meta?.name || '');
  const [name, setName] = useState(base);
  const [requireSigned, setRequireSigned] = useState(!!data?.requireSignedURLs);
  const [updating, startUpdateTransition] = useTransition();

  // Sync when data changes (e.g., loaded after mount)
  useEffect(() => {
    setName(base);
    setRequireSigned(!!data?.requireSignedURLs);
  }, [data?.meta?.name, data?.requireSignedURLs]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!data) return;
    startUpdateTransition(async () => {
      try {
        const body = {
          streamId: data.uid,
          meta: { name: `${name}${extension ? `.${extension}` : ''}` },
          requireSignedURLs: requireSigned,
        };

        const res = await updateStream(data.uid, body);

        const updated = (res.result || res) as StreamVideo;
        onUpdate?.(updated);
        toast.success('Stream updated successfully');
      } catch (errorUnknown: unknown) {
        toast.error((errorUnknown as any)?.message || String(errorUnknown));
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Бичлэгийн нэр</label>
        <Input
          value={name}
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Cloudflare ID</label>
        <div className="relative">
          <Input value={data?.uid} disabled placeholder="Cloudflare ID" />
          {data?.uid && (
            <button
              type="button"
              className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              onClick={() =>
                handleCopy(data.uid, () =>
                  toast.success('ID copied to clipboard'),
                )
              }
            >
              <Copy size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="border-destructive/30 bg-destructive/5 flex items-center justify-between rounded-md border p-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Бичлэгийн төрөл
          </label>
          <p className="text-muted-foreground text-sm">
            Идэвхижүүлснээр бичлэгийг кино болгон тохируулна. Үгүй бол трейлер
            болно.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              'rounded-full text-xs',
              requireSigned ? 'bg-destructive/30' : 'bg-input',
            )}
          >
            {requireSigned ? 'Кино' : 'Трейлер'}
          </Badge>
          <Switch
            checked={requireSigned}
            onCheckedChange={(v) => setRequireSigned(Boolean(v))}
            className="data-[state=checked]:bg-destructive/30"
            thumbClassName="bg-background/75 data-[state=checked]:bg-background"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" type="submit" disabled={updating}>
          {updating && <Loader2 className="animate-spin" />}
          Update
        </Button>
      </div>
    </form>
  );
}

function PreviewTab({ video }: { video?: StreamVideo }) {
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

function CaptionsTab() {
  return (
    <div className="space-y-2 py-2">
      <div className="text-muted-foreground text-sm">
        No captions available for this stream.
      </div>
    </div>
  );
}
