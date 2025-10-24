'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { UppyUpload } from '@/app/(dashboard)/streams/uppy';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-medium">Кино оруулах</h1>
      </div>
      <UppyUpload />
    </div>
  );
}
