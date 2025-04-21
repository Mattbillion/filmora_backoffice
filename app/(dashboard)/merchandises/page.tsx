import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getCategoriesHash } from '@/features/category/actions';
import { getCompanyListHash } from '@/features/companies/actions';
import { getDiscountsHash } from '@/features/discounts/actions';
import { SearchParams } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getMerchandisesList } from './actions';
import { merchandisesColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function MerchandisesPage(props: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const [
    { data },
    { data: categoryData },
    { data: companyData },
    { data: discountData },
  ] = await Promise.all([
    getMerchandisesList({
      ...searchParams,
      company_id: session?.user?.company_id,
    }),
    getCategoriesHash(),
    getCompanyListHash(),
    getDiscountsHash({ company_id: session?.user?.company_id }),
  ]);

  console.log(discountData);
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Merchandises list (${data?.total_count ?? data?.data?.length})`}
        />
        {checkPermission(session, []) && (
          <CreateDialog>
            <Button className="text-xs md:text-sm">
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </CreateDialog>
        )}
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={merchandisesColumns}
          data={data?.data?.map((c) => ({
            ...c,
            category: categoryData[c.cat_id] || '',
            company: companyData[c.com_id] || '',
            discount: discountData[c.discount_id] || '',
          }))}
          rowCount={data?.total_count ?? data?.data?.length}
        />
      </Suspense>
    </>
  );
}
