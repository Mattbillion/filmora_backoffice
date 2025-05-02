'use client';

import { useEffect, useState, useTransition } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAttributes,
  getAttributeValues,
} from '@/features/attributes/actions';
import { ID } from '@/lib/fetch/types';
import { checkPermission } from '@/lib/permission';

import { getVariantOptionValueList } from './actions';
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
  const [loading, startLoadingTransition] = useTransition();
  const { data: session } = useSession();

  useEffect(() => {
    getAttributes({ page_size: 10000 }).then((c) =>
      setAttributes(
        (c.data.data || []).reduce(
          (acc, curr) => ({ ...acc, [curr.id]: curr.attr_name }),
          {},
        ),
      ),
    );
    getAttributeValues({ page_size: 10000 }).then((c) =>
      setAttributeValues(
        (c.data.data || []).reduce(
          (acc, curr) => ({ ...acc, [curr.id]: curr.value }),
          {},
        ),
      ),
    );
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
        <Button type="button" variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Option
        </Button>
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
            {optionValues.length === 0 ? (
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
                      <OptionValueDialog initialData={optionValue}>
                        <Button variant="ghost" size="icon" type="button">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </OptionValueDialog>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
