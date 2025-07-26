'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={router.back}
      className={cn(
        'rounded-full p-1 transition-colors hover:bg-muted',
        className,
      )}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
