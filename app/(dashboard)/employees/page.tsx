import { Suspense } from 'react';
import { Plus } from 'lucide-react';

import { auth } from '@/app/(auth)/auth';
import { Heading } from '@/components/custom/heading';
import StatusFilter from '@/components/custom/table/status-filter';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getCompany } from '@/features/companies/actions';
import { SearchParams } from '@/lib/fetch/types';

import { getEmployeeList } from './actions';
import { employeeColumns } from './columns';
import { CreateDialog } from './components';

export const dynamic = 'force-dynamic';

export default async function EmployeePage(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const companyId = session?.user.company_id ?? 0;
  const { data } = await getEmployeeList({
    ...searchParams,
    company_id: companyId,
  });
  const { data: EmployeeCompany } = await getCompany(companyId);
  const company_name = EmployeeCompany?.data.company_name ?? '';
  const employeesWithCompany = data?.data.map((employee) => ({
    ...employee,
    company_name,
  }));

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Employee list (${data?.total_count ?? data?.data?.length})`}
          description={session?.user?.company_name}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          columns={employeeColumns}
          data={employeesWithCompany}
          rowCount={employeesWithCompany.length}
        >
          <StatusFilter />
        </DataTable>
      </Suspense>
    </>
  );
}
