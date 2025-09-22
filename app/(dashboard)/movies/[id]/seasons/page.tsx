import { Suspense } from 'react';

import { Heading } from '@/components/custom/heading';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/services/api/types';
import { getMovie } from '@/services/movies-generated';
import { getSeriesSeasons } from '@/services/seasons';

import { seasonsColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function SeasonsPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: SearchParams<{
    page?: number;
    page_size?: number;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { data: movie } = await getMovie(params.id);
  const { data, total_count } = await getSeriesSeasons(params.id, searchParams);

  const list = data || [];
  const count = total_count ?? list.length;

  return (
    <>
      <ReplaceBreadcrumdItem
        data={{
          movies: {
            value: movie.title,
            selector: params.id,
          },
        }}
      />
      <div className="flex items-start justify-between">
        <Heading title={`Seasons list (${count})`} />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable columns={seasonsColumns} data={list} rowCount={count} />
      </Suspense>
    </>
  );
}
