import { ID } from "@/lib/fetch/types";
import { purchaseColumns, purchaseTrainingColumns } from "./columns";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { PurchaseTypeEnum, purchaseTypeObj } from "./schema";
import { getPurchases, getUser } from "./actions";
import { Link } from "@/components/custom/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { ConnectItemWrapper } from "./components";

export const dynamic = "force-dynamic";

export default async function UserDetail(props: {
  params: Promise<{ id: ID }>;
  searchParams: Promise<{
    purchaseType: PurchaseTypeEnum;
    page: number;
    limit: number;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { data } = await getPurchases({
    userId: params.id,
    ...searchParams,
  });

  const purchaseType = (
    purchaseTypeObj[searchParams.purchaseType] ?? ""
  ).toLowerCase();

  const columns =
    Number(searchParams.purchaseType) === 4
      ? purchaseTrainingColumns
      : purchaseColumns;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <Heading
          title={`Purchased ${purchaseType}s (${
            data?.pagination?.total ?? data?.data?.length
          })`}
        />
        <ConnectItemWrapper type={searchParams.purchaseType}>
          <Button className="text-xs md:text-sm">Connect {purchaseType}</Button>
        </ConnectItemWrapper>
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfile id={params.id} />
        </Suspense>
        <PurchaseTypes userId={params.id} />
      </div>
      <DataTable
        columns={columns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}

function PurchaseTypes({ userId }: { userId: ID }) {
  return (
    <div className="flex h-10 items-center space-x-1 rounded-md border bg-background p-1">
      {Object.entries(purchaseTypeObj).map(([t, label], idx) => (
        <Link
          href={`/users/${userId}?purchaseType=${t}`}
          key={idx}
          byParam="purchaseType"
          withChildRoutes
          activeClassName="bg-accent text-accent-foreground"
          className="flex select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

async function UserProfile({ id }: { id: ID }) {
  const { data: dataUser } = await getUser(id);

  return (
    <div className="flex items-center gap-2 bg-accent rounded-3xl py-2 px-2 pr-3">
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage
          src={apiImage(dataUser?.data?.avatar, "xs")}
          alt={dataUser?.data?.nickname ?? ""}
        />
        <AvatarFallback className="rounded-lg">
          {dataUser?.data?.email?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-bold leading-none">
          {dataUser?.data.nickname || "Unknown"}
        </p>
        <p className="text-xs opacity-80">{dataUser?.data.email}</p>
      </div>
    </div>
  );
}

function UserProfileSkeleton() {
  return (
    <div className="w-1/3 flex items-center gap-2 bg-accent rounded-3xl py-2 px-2 pr-3 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-slate-100 opacity-50" />
      <div className="flex-1">
        <div className="h-4 w-1/2 rounded-lg bg-slate-100 opacity-50 mb-1" />
        <div className="h-2.5 w-full rounded-lg bg-slate-100 opacity-50" />
      </div>
    </div>
  );
}
