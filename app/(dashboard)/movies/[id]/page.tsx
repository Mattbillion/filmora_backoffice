import { Suspense } from 'react';

import { getMoviesDetail } from '../actions';
import Client from './client';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movieData = await getMoviesDetail(id);

  if (!movieData.data?.data) {
    return <div>Movie not found</div>;
  }
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Client data={movieData.data?.data} />
      </Suspense>
    </div>
  );
}
