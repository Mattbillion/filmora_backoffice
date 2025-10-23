// app/streams/StreamFilters.tsx (Client Component)
'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function StreamFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
      // Reset to page 1 when filter changes
      if (key !== 'page') {
        params.set('page', '1');
      }
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className={`filters ${isPending ? 'opacity-50' : ''}`}>
      {/* Search */}

      {/* Status Filter */}
      <select
        value={searchParams.get('status') || ''}
        onChange={(e) => updateParam('status', e.target.value)}
      >
        <option value="">All Status</option>
        <option value="ready">Ready</option>
        <option value="inprogress">In Progress</option>
        <option value="error">Error</option>
      </select>

      {/* Items per page */}
      <select
        value={searchParams.get('limit') || '50'}
        onChange={(e) => updateParam('limit', e.target.value)}
      >
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
    </div>
  );
}
