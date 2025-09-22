import { Suspense } from 'react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';
// import { getMovies } from '@/services/movies/service';
import { getMovies } from '@/services/movies-generated';

import { moviesColumns } from './columns';
import CreateMovie from './create-movie';

export const dynamic = 'force-dynamic';

export default async function MoviesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data, total_count } = await getMovies();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Movies list (${total_count ?? data.length})`} />
        <CreateMovie />
      </div>

      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={moviesColumns}
          data={data}
          rowCount={total_count ?? data?.length}
        />
      </Suspense>
    </>
  );
}
