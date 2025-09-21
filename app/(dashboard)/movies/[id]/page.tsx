import { Suspense } from 'react';

import { getMoviesDetail } from '@/services/movies/service';

import Client from './client';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movieData = await getMoviesDetail(id);

  if (!movieData.data) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Client initialData={movieData.data.data} />
      </Suspense>
    </div>
  );
}
