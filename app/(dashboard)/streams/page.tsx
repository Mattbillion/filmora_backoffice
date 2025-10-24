import { Suspense } from 'react';

import { fetchStream } from '@/lib/cloudflare';
import { StreamSearchParams } from '@/lib/cloudflare/type';

import { Client } from './client';

type Props = {
  searchParams?: Promise<StreamSearchParams>;
};

export default async function StreamsPage({ searchParams }: Props) {
  const data = await fetchStream(await searchParams);

  if (!data.errors) return null;

  return (
    <Suspense fallback="loading...">
      <Client data={data.videos} />
    </Suspense>
  );
}
