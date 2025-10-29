'use client';

import { Fragment, useEffect, useState, useTransition } from 'react';
import { Download, Loader2, Sparkles, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  fetchCaptions,
  fetchCaptionVTT,
  generateCaptions,
} from '@/lib/cloudflare';
import { CLOUDFLARE_LANGUAGES } from '@/lib/cloudflare/languages';
import {
  StreamCaption,
  SupportedCaptionLanguages,
} from '@/lib/cloudflare/type';
import { cn, downloadToPreview } from '@/lib/utils';

export function CaptionsTab({
  streamId,
  videoName,
}: {
  streamId?: string;
  videoName: string;
}) {
  const [captions, setCaptions] = useState<StreamCaption[]>([]);
  const [loading, startLoading] = useTransition();
  const [loadingVtt, startLoadingVtt] = useTransition();
  const [generating, startGenerateLoading] = useTransition();
  const [selectedCap, setSelectedCap] = useState<
    SupportedCaptionLanguages | undefined
  >();
  const [loadedCap, setLoadedCap] = useState<string>('');

  const loadCaptions = () => {
    if (streamId) {
      startLoading(() => {
        fetchCaptions(streamId)
          .then((c) => setCaptions(c.result))
          .catch((e) => {
            setCaptions([]);
            toast.error(e.message);
          });
      });
    }
  };

  useEffect(() => {
    if (streamId) {
      startLoading(() => {
        loadCaptions();
      });
    }
  }, [streamId]);

  const loadCaptionVtt = (lang?: SupportedCaptionLanguages) => {
    if (!lang) return;
    setSelectedCap(lang);
    startLoadingVtt(() => {
      fetchCaptionVTT(streamId!, lang).then((vtt) => setLoadedCap(vtt));
    });
  };

  if (!streamId)
    return (
      <div className="text-muted-foreground text-sm">
        No captions available for this stream.
      </div>
    );
  return (
    <div className="space-y-2 py-2">
      <div className="flex justify-between gap-4">
        <p>Captions ({captions.length})</p>
        <div className="flex items-center gap-2">
          {loadedCap && (
            <Button
              type="button"
              size="sm"
              onClick={() =>
                downloadToPreview(
                  new Blob([loadedCap], { type: 'text/plain;charset=utf-8' }),
                  `${videoName}-${selectedCap}.vtt`,
                )
              }
            >
              <Download /> Download
            </Button>
          )}
          <Button type="button" size="sm">
            <Upload /> Upload
          </Button>
          {!!streamId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={loading || generating}>
                <Button size="sm" type="button">
                  {generating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles />
                  )}{' '}
                  Generate caption
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {CLOUDFLARE_LANGUAGES.filter(
                  (c) => !captions.find((cc) => cc.language === c.code),
                ).map((caption, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onSelect={() =>
                      startGenerateLoading(() => {
                        generateCaptions(streamId, caption.code).then((c) =>
                          setCaptions((prev) => [...prev, c.result]),
                        );
                      })
                    }
                  >
                    {caption.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="animate-spin" />
        </div>
      ) : captions.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          No captions available for this stream.
        </div>
      ) : (
        <div className="flex max-h-screen min-h-96 items-stretch gap-2">
          <div className="w-1/4">
            {captions.map((c, i) => (
              <button
                key={i}
                className={cn(
                  'hover:bg-foreground/10 w-full cursor-pointer rounded-md px-2 py-2 !text-left text-sm font-medium',
                  {
                    'bg-background': selectedCap === c.language,
                  },
                )}
                disabled={loadingVtt}
                onClick={() => loadCaptionVtt(c.language)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {loadingVtt ? (
            <div className="flex flex-1 items-center justify-center border-l px-4 text-xs">
              <Loader2 className="animate-spin" />
            </div>
          ) : selectedCap ? (
            <div className="flex-1 overflow-y-auto border-l px-4 text-xs">
              <pre
                dangerouslySetInnerHTML={{ __html: loadedCap }}
                className="pb-12"
              />
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 border-l">
              <p>Select caption to preview</p>
              {!!captions.length && (
                <div className="flex items-center gap-2">
                  {captions.map((c, i) => (
                    <Fragment key={i}>
                      {i > 0 && (
                        <span className="bg-foreground/70 block size-1 rounded-full" />
                      )}
                      <button
                        type="button"
                        className="cursor-pointer text-xs underline opacity-70 hover:opacity-100"
                        onClick={() => loadCaptionVtt(c.language)}
                      >
                        {c.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
