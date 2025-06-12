'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import CurrencyItem from '@/components/custom/currency-item';
import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import UploadImageItem from '@/components/custom/upload-image-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { checkPermission } from '@/lib/permission';

import { deleteVariant, getVariantList, patchVariants } from './actions';
import { OptionTypesSheet } from './option-values/option-types-sheet';
import { VariantItemType, variantsBulkSchema } from './schema';

export function VariantsTab() {
  const { data: session } = useSession();
  const params = useParams();
  const [loading, startLoadingTransition] = useTransition();
  const [saving, startLoadingSaving] = useTransition();
  const [variants, setVariants] = useState<VariantItemType[]>([]);

  const form = useForm<{ updates: VariantItemType[] }>({
    resolver: zodResolver(variantsBulkSchema),
    defaultValues: {
      updates: variants.map((v) => ({ ...v, variant_id: v.id })),
    },
  });

  useEffect(() => {
    startLoadingTransition(() =>
      getVariantList((params?.id || '') as string, {
        filters: `merch_id=${params.id}`,
      }).then((c) => {
        setVariants(c.data.data || []);
        form.setValue(
          'updates',
          (c.data.data || []).map((v) => ({ ...v, variant_id: v.id })),
        );
      }),
    );
  }, []);

  const onSubmit = (values: { updates: VariantItemType[] }) => {
    startLoadingSaving(() => {
      // @ts-ignore
      patchVariants({ updates: values.updates }).then(() => {
        toast.success('Updated successfully');
      });
    });
  };

  return (
    <TabsContent value="variants" className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Manage product variants and stock</CardDescription>
          </div>
          {checkPermission(session, [
            'get_company_merchandise_attribute_option_value_list',
            'get_company_merchandise_attribute_option_value',
            'create_company_merchandise_attribute_option_value',
            'update_company_merchandise_attribute_option_value',
            'delete_company_merchandise_attribute_option_value',
          ]) && (
            <OptionTypesSheet
              canAddType={!variants?.length}
              onSave={(v) => {
                setVariants((prev) => {
                  const tmp = [...prev, ...v];
                  form.setValue(
                    'updates',
                    tmp.map((t) => ({ ...t, variant_id: t.id })),
                  );
                  return tmp;
                });
              }}
            >
              <Button>Option values</Button>
            </OptionTypesSheet>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Option values</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Master</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <RowSkeleton key={idx} />
                      ))
                    : variants.map((variant, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {variant.id}
                          </TableCell>
                          <TableCell>{variant.sku}</TableCell>
                          <TableCell>
                            <div className={'flex flex-wrap gap-2'}>
                              {variant?.attributes?.map((c) => (
                                <Badge
                                  key={`${c.option_type_id}_${c.attribute_value_id}`}
                                  variant="outline"
                                >
                                  {c.option_type_name}:{' '}
                                  <span className={'font-medium'}>
                                    {c.value}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormField
                              name={`updates.${idx}.merch_id`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Com id"
                                      {...field}
                                      type={'hidden'}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              // @ts-ignore
                              name={`updates.${idx}.variant_id`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    {/*@ts-ignore*/}
                                    <Input
                                      placeholder="Com id"
                                      {...field}
                                      type={'hidden'}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`updates.${idx}.image`}
                              render={({ field }) => (
                                <UploadImageItem
                                  field={field}
                                  imagePrefix={field.name}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`updates.${idx}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <CurrencyItem
                                      field={field}
                                      placeholder={'0'}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`updates.${idx}.stock`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      placeholder="0"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            {variant.is_master ? (
                              <Badge>Master</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {variant.status ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableAction
                            variant={variant}
                            onRemove={() =>
                              setVariants((oldVariants) =>
                                oldVariants.filter((c) => c.id !== variant.id),
                              )
                            }
                          />
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              {!!variants?.length && (
                <div className={'mt-5 flex justify-end'}>
                  <Button
                    type="submit"
                    className={'min-w-[200px]'}
                    disabled={saving}
                  >
                    Save
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function TableAction({
  variant,
  onRemove,
}: {
  variant: VariantItemType;
  onRemove: () => void;
}) {
  const { data } = useSession();
  const [removing, startRemoveTransition] = useTransition();
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const canDelete = checkPermission(data, [
    'delete_company_merchandise_attribute_value',
  ]);

  if (!canDelete) return null;
  return (
    <TableCell className="text-right">
      <div className="flex justify-end">
        {canDelete && (
          <DeleteDialog
            ref={deleteDialogRef}
            loading={removing}
            action={() => {
              startRemoveTransition(() => {
                deleteVariant(variant.id, {}).then(() => onRemove());
              });
            }}
            confirmText="Delete"
            description={
              <>
                Are you sure you want to delete this{' '}
                <b className="text-foreground">{variant.sku}</b>?
              </>
            }
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </DeleteDialog>
        )}
      </div>
    </TableCell>
  );
}

function RowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <Skeleton className="h-5 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-md" />
      </TableCell>
    </TableRow>
  );
}
