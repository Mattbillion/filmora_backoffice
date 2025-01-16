import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/lib/fetch/types";
import { getUsers } from "./actions";
import { userColumns } from "./columns";
import { Search } from "./components";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Users(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getUsers(searchParams);

  return (
    <>
      <Heading
        title={`Users (${data?.pagination?.total ?? data?.data?.length})`}
      />
      <Separator />
      <Suspense>
        <Search />
      </Suspense>
      <DataTable
        columns={userColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
