import { Suspense } from 'react';

import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/services/api/types';
import { getUploadedImages } from '@/services/images';

import { imagesColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function ImagesPage(props: {
  searchParams?: SearchParams<{
    page?: number;
    page_size?: number;
    content_type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { data, total_count, pagination } = await getUploadedImages(
    // Check and fix, its generated and might be dumb
    searchParams,
  );

  const list = data || [];
  const count = total_count ?? list.length;

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Зурагууд (${count})`} />
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={imagesColumns}
          data={list}
          rowCount={pagination.total}
          pageCount={pagination.total_pages}
        />
      </Suspense>
    </>
  );
}
