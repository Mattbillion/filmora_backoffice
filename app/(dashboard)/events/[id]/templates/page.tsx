import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getTemplates } from './actions';
import { templatesColumns } from './columns';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage(props: {
  searchParams?: SearchParams;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const { data } = await getTemplates({
    ...searchParams,
    event_id: id,
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Templates list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, []) && (
          <Link href="/build-template" className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Link>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={templatesColumns}
          data={data?.data}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
