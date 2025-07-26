'use client';

import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useZoomControl } from '../seatmap/hooks';

export default function ZoomControl() {
  const { zoomOut, zoomIn, percentage } = useZoomControl();

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-md"
        onClick={zoomOut}
      >
        <Minus />
      </Button>
      <p className="flex h-10 w-[60px] items-center justify-center rounded-md bg-neutral-900 text-white">
        {percentage + '%'}
      </p>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-md"
        onClick={zoomIn}
      >
        <Plus />
      </Button>
    </div>
  );
}
