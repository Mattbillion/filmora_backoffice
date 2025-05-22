'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import dayjs from 'dayjs';
import { Edit, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { VariantCreateSheet } from '@/app/(dashboard)/merchandises/[id]/tabs/variants-tab/variant-create-sheet';
import { VariantEditSheet } from '@/app/(dashboard)/merchandises/[id]/tabs/variants-tab/variant-update-sheet';
import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

import { deleteVariant, getVariantList } from './actions';
import { VariantItemType } from './schema';

export function VariantsTab({ cat_id }: { cat_id: number }) {
  const { data: session } = useSession();
  const params = useParams();
  const [loading, startLoadingTransition] = useTransition();
  const [variants, setVariants] = useState<VariantItemType[]>([]);

  const fetchVariants = () => {
    startLoadingTransition(() =>
      getVariantList({ filters: `merch_id=${params.id}` }).then((c) =>
        setVariants(c.data.data || []),
      ),
    );
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  return (
    <TabsContent value="variants" className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Manage product variants and stock</CardDescription>
          </div>
          {checkPermission(session, [
            'create_company_merchandise_attribute_value',
          ]) && (
            <VariantCreateSheet onSave={fetchVariants} cat_id={cat_id}>
              <Button>Add Variant</Button>
            </VariantCreateSheet>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Master</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
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
                      <TableCell>{variant.stock}</TableCell>
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
                      <TableCell>
                        {dayjs(variant.created_at).format('YYYY-MM-DD hh:mm')}
                      </TableCell>
                      <TableAction
                        variant={variant}
                        onSave={fetchVariants}
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
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function TableAction({
  variant,
  onRemove,
  onSave,
}: {
  variant: VariantItemType;
  onRemove: () => void;
  onSave: () => void;
}) {
  const { data } = useSession();
  const [removing, startRemoveTransition] = useTransition();
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const canDelete = checkPermission(data, [
    'delete_company_merchandise_attribute_value',
  ]);
  const canEdit = checkPermission(data, [
    'update_company_merchandise_attribute_value',
  ]);

  if (!canEdit && !canDelete) return null;
  return (
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        {canEdit && (
          <VariantEditSheet variant={variant} onSave={onSave}>
            <Button size="icon" variant="ghost" type="button">
              <Edit className="h-4 w-4" />
            </Button>
          </VariantEditSheet>
        )}
        {canDelete && (
          <DeleteDialog
            ref={deleteDialogRef}
            loading={removing}
            action={() => {
              startRemoveTransition(() => {
                deleteVariant(variant.id).then(() => onRemove());
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
        <Skeleton className="h-5 w-32" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}
