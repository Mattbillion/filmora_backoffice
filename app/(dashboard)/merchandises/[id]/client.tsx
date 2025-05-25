'use client';

import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  deleteMerchandises,
  patchMerchandises,
} from '@/app/(dashboard)/merchandises/actions';
import {
  MerchandisesBodyType,
  MerchandisesItemType,
  merchandisesSchema,
} from '@/app/(dashboard)/merchandises/schema';
import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { FormDialogRef } from '@/components/custom/form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HierarchicalCategory } from '@/features/category/schema';
import { DiscountsItemType } from '@/features/discounts/schema';
import { checkPermission } from '@/lib/permission';

import { DetailsTab } from './tabs/details-tab';
import { ImagesTab } from './tabs/images-tab';
import { VariantsTab } from './tabs/variants-tab';

export default function MerchDetailClient({
  initialData,
  categories = [],
  discounts = [],
}: {
  initialData: MerchandisesItemType;
  categories: HierarchicalCategory[];
  discounts: DiscountsItemType[];
}) {
  const [activeTab, setActiveTab] = useState('details');
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const canDelete = checkPermission(session, ['delete_company_merchandise']);

  const canAccessVariants = checkPermission(session, [
    'get_company_merchandise_attribute_value_list',
    'get_company_merchandise_attribute_value',
    'create_company_merchandise_attribute_value',
    'update_company_merchandise_attribute_value',
    'delete_company_merchandise_attribute_value',
    'get_company_merchandise_attribute_option_value_list',
    'get_company_merchandise_attribute_option_value',
    'create_company_merchandise_attribute_option_value',
    'update_company_merchandise_attribute_option_value',
    'delete_company_merchandise_attribute_option_value',
  ]);

  const form = useForm<MerchandisesBodyType>({
    resolver: zodResolver(merchandisesSchema),
    defaultValues: initialData,
  });

  function onSubmit(values: MerchandisesBodyType) {
    startTransition(() => {
      patchMerchandises({
        ...values,
        id: initialData.id,
      })
        .then(() => {
          toast.success('Updated successfully');
          dialogRef?.current?.close();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/merchandises">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Merchandise Details</h1>
          <Badge variant={initialData.status ? 'default' : 'secondary'}>
            {initialData.status ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Product ID and metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            ID: {initialData.id} • Created:{' '}
            {dayjs(initialData.created_at).format('YYYY-MM-DD hh:mm')} • Last
            Updated: {dayjs(initialData.updated_at).format('YYYY-MM-DD hh:mm')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main content tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              {canAccessVariants && (
                <TabsTrigger value="variants">Variants</TabsTrigger>
              )}
            </TabsList>

            <DetailsTab
              control={form.control}
              discounts={discounts}
              categories={categories}
            />

            <ImagesTab control={form.control} />

            {activeTab !== 'variants' && (
              <div className="mt-6 flex justify-end gap-6">
                {canDelete && (
                  <DeleteDialog
                    ref={deleteDialogRef}
                    loading={deleting}
                    action={() => {
                      setDeleting(true);
                      deleteMerchandises(initialData.id)
                        .then((c) => {
                          toast.success(c.data.message);
                          router.push('/merchandises');
                        })
                        .catch((c) => toast.error(c.message))
                        .finally(() => {
                          deleteDialogRef.current?.close();
                          setDeleting(false);
                        });
                    }}
                    description={
                      <>
                        Are you sure you want to delete this{' '}
                        <b className="text-foreground">
                          {initialData.mer_name}
                        </b>
                        ?
                      </>
                    }
                  >
                    <Button type="button" variant="destructive">
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </DeleteDialog>
                )}
                <Button disabled={isPending} type={'submit'}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
        {canAccessVariants && <VariantsTab />}
      </Tabs>
    </div>
  );
}
