'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { imageResize } from '@/lib/utils';

import { getTemplateDetail } from '../actions';
import { SVGJsonType } from '../schema';
import { INITIAL_SCALE } from './constants';
import XooxStage from './stage';
import { getStyleStr, parseCSS, svgToKonva } from './svg-to-konva';

export default function Client() {
  const router = useRouter();
  const { templateId } = useParams();
  const { data: session } = useSession();
  const [{ templateJSON = [], viewBox }, setTemplateData] = useState<{
    templateJSON: SVGJsonType[];
    viewBox: [number, number];
  }>({ templateJSON: [], viewBox: [1024, 960] });
  const [vbw = 1024, vbh = 960] = viewBox;
  const styleJson = parseCSS(getStyleStr(templateJSON));

  useEffect(() => {
    if (!isNaN(Number(templateId as unknown as string)))
      getTemplateDetail(Number(templateId)).then((c) => setTemplateData(c));
  }, [templateId]);

  const shapes = useMemo(
    () => templateJSON.map((c) => svgToKonva(c, styleJson)),
    [templateJSON],
  );

  const [width, height] = (() => {
    if (typeof window === 'undefined') return viewBox;
    return [window.innerWidth, window.innerHeight];
  })();
  const stageWidth = width - 462;
  const stageHeight = height - 64;

  return (
    <div>
      <header className="flex h-16 items-center border-b px-4">
        <div className="flex flex-1 items-center gap-2">
          <button
            onClick={router.back}
            className="rounded-full p-1 transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium">Seat builder</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={imageResize(session?.user?.profile ?? '', 'small')}
                alt={session?.user?.name ?? ''}
              />
              <AvatarFallback className="rounded-full">
                {session?.user?.email?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.profile ?? ''}
                    alt={session?.user?.name ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">
                    {' '}
                    {session?.user?.email?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user?.name ?? ''}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user?.email ?? ''}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ redirectTo: '/login' })}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <XooxStage
        shapes={shapes}
        height={stageHeight}
        width={stageWidth}
        limitX={vbw * 0.9}
        limitY={vbh * 0.9}
        scale={INITIAL_SCALE}
        centerCoord={{
          x: (stageWidth - vbw * INITIAL_SCALE.x) / 2,
          y: (stageHeight - vbh * INITIAL_SCALE.y) / 2,
        }}
      />
    </div>
  );
}
