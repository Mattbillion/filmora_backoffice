'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAttributesHash,
  getAttributeValuesHash,
} from '@/features/attributes/actions';
import { ID } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { deleteVariantOptionValue, getVariantOptionValueList } from './actions';
import { CreateOptionValueDialog } from './option-create-dialog';
import { OptionValueDialog } from './option-update-dialog';
import { VariantOptionValueItemType } from './schema';

export function OptionValues({ variantId }: { variantId: ID }) {
  const [optionValues, setOptionValues] = useState<
    VariantOptionValueItemType[]
  >([]);
  const [attributes, setAttributes] = useState<Record<ID, string>>([]);
  const [attributeValues, setAttributeValues] = useState<Record<ID, string>>(
    [],
  );
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const [removing, startRemoveTransition] = useTransition();
  const [loading, startLoadingTransition] = useTransition();
  const [loadingAttr, startLoadingAttrTransition] = useTransition();
  const { data: session } = useSession();

  useEffect(() => {
    startLoadingAttrTransition(() => {
      Promise.all([
        getAttributesHash({ page_size: 10000 }),
        getAttributeValuesHash({ page_size: 10000 }),
      ]).then(([attributesData, attributeValuesData]) => {
        setAttributes(attributesData.data);
        setAttributeValues(attributeValuesData.data);
      });
    });
  }, []);

  useEffect(() => {
    startLoadingTransition(() => {
      getVariantOptionValueList({ filters: `m_attr_val_id=${variantId}` }).then(
        (c) => setOptionValues(c.data.data || []),
      );
    });
  }, [variantId]);

  if (
    !checkPermission(session, [
      'get_company_merchandise_attribute_option_value_list',
      'get_company_merchandise_attribute_option_value',
      'create_company_merchandise_attribute_option_value',
      'update_company_merchandise_attribute_option_value',
      'delete_company_merchandise_attribute_option_value',
    ])
  )
    return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Option Values</h3>
        {checkPermission(session, [
          'create_company_merchandise_attribute_option_value',
        ]) && (
          <CreateOptionValueDialog>
            <Button type="button" variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </CreateOptionValueDialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Option Name</TableHead>
              <TableHead>Option Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || loadingAttr ? (
              <RowSkeleton />
            ) : optionValues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No option values added yet
                </TableCell>
              </TableRow>
            ) : (
              optionValues.map((optionValue) => (
                <TableRow key={optionValue.id}>
                  <TableCell>{attributes[optionValue.attr_id]}</TableCell>
                  <TableCell>
                    {attributeValues[optionValue.attr_val_id]}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {checkPermission(session, [
                        'update_company_merchandise_attribute_option_value',
                      ]) && (
                        <OptionValueDialog initialData={optionValue}>
                          <Button variant="ghost" size="icon" type="button">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </OptionValueDialog>
                      )}
                      {checkPermission(session, [
                        'delete_company_merchandise_attribute_option_value',
                      ]) && (
                        <DeleteDialog
                          ref={deleteDialogRef}
                          loading={removing}
                          action={() => {
                            startRemoveTransition(() => {
                              deleteVariantOptionValue(optionValue.id).then(
                                () =>
                                  setOptionValues((prevOptVals) =>
                                    prevOptVals.filter(
                                      (c) => c.id !== optionValue.id,
                                    ),
                                  ),
                              );
                            });
                          }}
                          confirmText="Delete"
                          description={
                            <>
                              Are you sure you want to delete this{' '}
                              <b className="text-foreground">
                                {attributes[optionValue.attr_id]}
                              </b>
                              ?
                            </>
                          }
                        >
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </DeleteDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
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
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}
