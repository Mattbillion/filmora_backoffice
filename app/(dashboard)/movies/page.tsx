import { Suspense } from 'react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';
import { getMovies } from '@/services/movies/service';

import { moviesColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function MoviesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const { data } = await getMovies();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Movies list (${data?.total_count ?? data?.data.length})`}
        />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={moviesColumns}
          data={data?.data.data}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
