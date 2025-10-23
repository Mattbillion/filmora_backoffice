import { Suspense } from 'react';

import { fetchStream } from '@/lib/cloudflare';

import { Client } from './client';

type Props = {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  };
};

export default async function StreamsPage({ searchParams }: Props) {
  const data = await fetchStream({
    status: 'ready',
  });

  if (!data.errors) return;

  return (
    <Suspense fallback="loading...">
      <Client data={data.videos} />
    </Suspense>
  );
}
