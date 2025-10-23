// app/streams/page.tsx
import { Suspense } from 'react';

import { StreamFilters } from './stream_filters';
import { StreamList } from './stream_list';

type Props = {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
};

export default function StreamsPage({ searchParams }: Props) {
  return (
    <div>
      <h1>Cloudflare Streams</h1>
      <StreamFilters />
      <Suspense fallback={<div>Loading streams...</div>}>
        <StreamList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
